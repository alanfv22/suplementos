// importar-productos.mjs
// Uso: node importar-productos.mjs proteinas.xlsx
//
// Instalá las dependencias antes de correr por primera vez:
// npm install xlsx @supabase/supabase-js dotenv sharp
//
// Estructura de imágenes esperada:
// C:\Users\Alan Veron\Desktop\Proyectos Generales\Suplementos\Imagenes\Proteinas\
//   whey-protein-truemade-1.webp   ← principal (número más bajo = principal)
//   whey-protein-truemade-2.webp   ← secundaria
//   whey-100-1.webp
//   etc.

import { createClient } from '@supabase/supabase-js'
import XLSX from 'xlsx'
import * as dotenv from 'dotenv'
import sharp from 'sharp'
import { readFileSync, readdirSync, existsSync } from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

// =============================================
// CONFIGURACIÓN
// =============================================

// Ruta a la carpeta de imágenes en tu PC
const CARPETA_IMAGENES = 'C:\\Users\\Alan Veron\\Desktop\\Proyectos Generales\\Suplementos\\Imagenes\\Proteinas'

// Nombre del bucket en Supabase Storage
const BUCKET = 'Suplementos'

// Tamaño máximo (mantiene proporción)
const MAX_WIDTH = 800
const MAX_HEIGHT = 800

// Calidad de compresión WebP (0-100)
const CALIDAD_WEBP = 80

// =============================================
// VALIDAR VARIABLES DE ENTORNO
// =============================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const storeId = process.env.NEXT_PUBLIC_STORE_ID

if (!supabaseUrl || !supabaseKey || !storeId) {
  console.error('❌ Faltan variables de entorno. Verificá .env o .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// =============================================
// LEER ARCHIVO XLSX
// =============================================
const archivo = process.argv[2]
if (!archivo) {
  console.error('❌ Indicá el archivo. Ejemplo: node importar-productos.mjs proteinas.xlsx')
  process.exit(1)
}

console.log(`\n📂 Leyendo archivo: ${archivo}`)
let rows
try {
  const workbook = XLSX.readFile(path.resolve(archivo))
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  rows = XLSX.utils.sheet_to_json(sheet)
  console.log(`✅ ${rows.length} filas encontradas`)
} catch (e) {
  console.error('❌ No se pudo leer el archivo:', e.message)
  process.exit(1)
}

// =============================================
// CARGAR CATEGORÍAS Y MARCAS DE SUPABASE
// =============================================
console.log('\n🔄 Cargando categorías y marcas desde Supabase...')

const { data: categorias, error: errCat } = await supabase
  .from('categories')
  .select('id, slug')
  .eq('store_id', storeId)

if (errCat) {
  console.error('❌ Error cargando categorías:', errCat.message)
  process.exit(1)
}

const { data: marcas, error: errMarca } = await supabase
  .from('brands')
  .select('id, slug, name')
  .eq('store_id', storeId)

if (errMarca) {
  console.error('❌ Error cargando marcas:', errMarca.message)
  process.exit(1)
}

const catMap = Object.fromEntries(categorias.map(c => [c.slug, c.id]))
const marcaMap = Object.fromEntries(marcas.map(m => [m.slug, m.id]))

console.log(`✅ ${categorias.length} categorías y ${marcas.length} marcas cargadas`)
console.log(`   Categorías: ${Object.keys(catMap).join(', ')}`)
console.log(`   Marcas: ${Object.keys(marcaMap).join(', ')}`)

// =============================================
// AGRUPAR FILAS POR NOMBRE DE PRODUCTO
// =============================================
const productosMap = {}

for (const row of rows) {
  const name = row.name?.toString().trim()
  if (!name) {
    console.warn('⚠️  Fila sin nombre ignorada')
    continue
  }

  if (!productosMap[name]) {
    productosMap[name] = {
      name,
      description: row.description?.toString().trim() || '',
      base_price: Number(row.base_price) || 0,
      category_slug: row.category_slug?.toString().trim(),
      brand_slug: row.brand_slug?.toString().trim(),
      image_slug: row.image_slug?.toString().trim(),
      variantes: []
    }
  }

  if (row.variant_label) {
    productosMap[name].variantes.push({
      label: row.variant_label.toString().trim(),
      price_override: row.variant_price ? Number(row.variant_price) : null,
      stock: row.stock ? Number(row.stock) : null,
      active: true
    })
  }
}

const productos = Object.values(productosMap)
console.log(`\n📦 ${productos.length} productos únicos encontrados`)

// =============================================
// FUNCIÓN: COMPRIMIR Y SUBIR IMAGEN
// =============================================
async function subirImagen(rutaLocal, nombreEnStorage) {
  try {
    const buffer = readFileSync(rutaLocal)
    const originalKB = Math.round(buffer.length / 1024)

    // Comprimir con sharp
    const comprimido = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: CALIDAD_WEBP })
      .toBuffer()

    const comprimidoKB = Math.round(comprimido.length / 1024)

    // Subir a Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(nombreEnStorage, comprimido, {
        contentType: 'image/webp',
        upsert: true
      })

    if (error) {
      console.error(`   ❌ Error subiendo imagen: ${error.message}`)
      return null
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(nombreEnStorage)

    console.log(`   📸 ${nombreEnStorage} (${originalKB}KB → ${comprimidoKB}KB, ${Math.round((1 - comprimidoKB/originalKB)*100)}% reducción)`)
    return urlData.publicUrl

  } catch (e) {
    console.error(`   ❌ Error procesando imagen ${rutaLocal}: ${e.message}`)
    return null
  }
}

// =============================================
// FUNCIÓN: BUSCAR IMÁGENES DE UN PRODUCTO
// =============================================
function buscarImagenes(imageSlug) {
  if (!existsSync(CARPETA_IMAGENES)) {
    console.warn(`⚠️  Carpeta de imágenes no encontrada: ${CARPETA_IMAGENES}`)
    return []
  }

  const extensiones = ['.webp', '.jpg', '.jpeg', '.png']
  const archivos = readdirSync(CARPETA_IMAGENES)

  const imagenes = archivos
    .filter(f => {
      const ext = path.extname(f).toLowerCase()
      const nombreSinExt = f.replace(ext, '')
      return extensiones.includes(ext) && nombreSinExt.startsWith(imageSlug + '-')
    })
    .sort()

  return imagenes.map((f, index) => ({
    rutaLocal: path.join(CARPETA_IMAGENES, f),
    nombreArchivo: f,
    isPrimary: index === 0,
    sortOrder: index + 1
  }))
}

// =============================================
// PROCESAR CADA PRODUCTO
// =============================================
let insertados = 0
let actualizados = 0
let errores = 0

for (const producto of productos) {
  console.log(`\n⚙️  Procesando: ${producto.name}`)

  // Validar categoría
  const categoryId = catMap[producto.category_slug]
  if (!categoryId) {
    console.error(`❌ Categoría no encontrada: "${producto.category_slug}"`)
    console.error(`   Disponibles: ${Object.keys(catMap).join(', ')}`)
    errores++
    continue
  }

  // Validar marca
  const brandId = marcaMap[producto.brand_slug]
  if (!brandId) {
    console.error(`❌ Marca no encontrada: "${producto.brand_slug}"`)
    console.error(`   Disponibles: ${Object.keys(marcaMap).join(', ')}`)
    errores++
    continue
  }

  // Verificar si ya existe el producto
  const { data: existente } = await supabase
    .from('products')
    .select('id')
    .eq('store_id', storeId)
    .eq('name', producto.name)
    .maybeSingle()

  let productId

  if (existente) {
    // ACTUALIZAR precio y descripción
    const { error } = await supabase
      .from('products')
      .update({
        description: producto.description,
        base_price: producto.base_price,
        category_id: categoryId,
        brand_id: brandId,
      })
      .eq('id', existente.id)

    if (error) {
      console.error(`❌ Error actualizando: ${error.message}`)
      errores++
      continue
    }

    productId = existente.id
    actualizados++
    console.log(`🔄 Producto actualizado`)

  } else {
    // INSERTAR nuevo producto
    const { data, error } = await supabase
      .from('products')
      .insert({
        store_id: storeId,
        category_id: categoryId,
        brand_id: brandId,
        name: producto.name,
        description: producto.description,
        base_price: producto.base_price,
        active: true,
        sort_order: 0
      })
      .select('id')
      .single()

    if (error) {
      console.error(`❌ Error insertando: ${error.message}`)
      errores++
      continue
    }

    productId = data.id
    insertados++
    console.log(`✅ Producto insertado`)
  }

  // VARIANTES — borrar y recrear
  if (producto.variantes.length > 0) {
    await supabase.from('product_variants').delete().eq('product_id', productId)

    const { error: errVar } = await supabase
      .from('product_variants')
      .insert(producto.variantes.map(v => ({ ...v, product_id: productId })))

    if (errVar) {
      console.error(`❌ Error en variantes: ${errVar.message}`)
    } else {
      console.log(`   └─ ${producto.variantes.length} variante(s) cargadas`)
    }
  }

  // IMÁGENES — buscar en carpeta local y subir
  if (producto.image_slug) {
    const imagenes = buscarImagenes(producto.image_slug)

    if (imagenes.length === 0) {
      console.log(`   ⚠️  Sin imágenes para: ${producto.image_slug}`)
      console.log(`       Descargá la imagen y nombrala: ${producto.image_slug}-1.webp`)
    } else {
      // Borrar imágenes anteriores
      await supabase.from('product_images').delete().eq('product_id', productId)

      for (const img of imagenes) {
        const nombreEnStorage = `proteinas/${producto.image_slug}/${img.nombreArchivo}`
        const url = await subirImagen(img.rutaLocal, nombreEnStorage)

        if (url) {
          await supabase.from('product_images').insert({
            product_id: productId,
            url,
            is_primary: img.isPrimary,
            sort_order: img.sortOrder
          })
        }
      }
    }
  }
}

// =============================================
// RESUMEN FINAL
// =============================================
console.log('\n==============================')
console.log('📊 RESUMEN DE IMPORTACIÓN')
console.log('==============================')
console.log(`✅ Insertados:   ${insertados}`)
console.log(`🔄 Actualizados: ${actualizados}`)
console.log(`❌ Errores:      ${errores}`)
console.log(`📦 Total:        ${productos.length}`)
console.log('==============================\n')
