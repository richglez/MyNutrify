// Collection-Foods -> server\src\models\Food.ts

import mongoose, { Schema, Document } from "mongoose";

// Crear Coleccion / Tabla
export interface IFood extends Document {
  // Crear Documentos / Filas
  name: string; // nombre del producto
  description?: string; // descripcion del producto
  calories: number; // calorias del producto
  protein: number; // proteina del producto
  carbs: number; // cabrohidratos del producto
  fat: number; // grasas del producto

  portionSize: number;
  unit: string; // g, kl, 1 pieza, etc...
  barcode?: string; // codigo de barras del producto
  brand?: string; // marca del producto

  createdBy?: mongoose.Types.ObjectId | null; // por el usuario o null = alimento global
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// Schema (Mongoose) = Reglas de la coleccion/tabla
const FoodSchema = new Schema<IFood>(
  {
    name: {
      type: String, // tipo texto
      required: true, // obligatorio
      index: true, // acelera busquedas? FoodSchema.index({ name: "text" }); para búsquedas tipo Google búsqueda rápida
      trim: true, // elimana espacios inecesarios, espacios al inicio espacios al final datos sucios
      lowercase: true, // 👉 evita problemas en búsqueda: "Manzana" "manzana" "MANZANA"
      maxlength: 100, // garantizar el rendimiento y evitar que un solo documento consuma recursos excesivos. y inputs maliciosos
    },
    description: {
      type: String, // tipo texto
      trim: true, // elimana espacios inecesarios, espacios al inicio espacios al final datos suciosf
    },
    calories: {
      // unidad base del alimento - calorías por porción base (normalmente 100g)
      type: Number,
      required: true, // es un campo obligatorio
      min: 0, // no permite valores negativos
    },
    protein: {
      type: Number,
      default: 0, // default evita errores si no vienen datos
      min: 0, // no permite valores negativos
    },
    carbs: {
      type: Number,
      default: 0, // default evita errores si no vienen datos
      min: 0, // no permite valores negativos
    },
    fat: {
      type: Number,
      default: 0, // default evita errores si no vienen datos
      min: 0, // no permite valores negativos
    },
    portionSize: {
      // medicion
      // calorías por porción base (normalmente 100g)
      type: Number,
      default: 100, // “este alimento está definido por 100g”
      min: 1, // no permite valores negativos ni ceros.
    },
    unit: {
      type: String,
      enum: ["g", "ml", "piece"],
      default: "g",
    },
    barcode: {
      type: String,
      unique: true, // valor unico -> no duplicados
      sparse: true, // permite nulls porque pueden haber varios nulls
    },
    brand: {
      type: String,
      trim: true,
      // index: true, // [para busquedas por marca en el futuro]
    },
    createdBy: {
      type: Schema.Types.ObjectId, // Esto crea una relación
      ref: "User", // con la coleccion 'user'
      default: null,
    },
    isVerified: {
      // alimentos verificado o confiables
      type: Boolean, // falso o verdadero
      default: false, // por defecto no  es alimento verificado
    },
  },
  {
    timestamps: true, // createdAt updatedAt
  },
);

// Búsqueda Potente
FoodSchema.index({ name: "text", brand: "text" });

// Coleccion
export default mongoose.model<IFood>("Food", FoodSchema);
