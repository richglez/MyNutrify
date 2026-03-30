// Collection-Meal -> server/src/models/Meal.ts

import mongoose, { Schema, Document } from "mongoose";

// Cada alimento dentro de una comida
export interface IMealItem {
  food: mongoose.Types.ObjectId; // referencia a Food
  quantity: number; // cuántos gramos/ml/piezas consumió
  // Macros calculados al momento del registro (snapshot)
  // Guardamos snapshot para que si el alimento se edita, el historial no cambie
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IMeal extends Document {
  user: mongoose.Types.ObjectId; // a quién pertenece
  date: Date; // fecha de la comida (sin hora exacta para agrupar por día)
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: IMealItem[]; // alimentos que componen la comida
  // Totales precalculados (evita recalcular en cada query)
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MealItemSchema = new Schema<IMealItem>(
  {
    food: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.1,
    },
    // Snapshot de macros al momento de registrar
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0, default: 0 },
    carbs: { type: Number, required: true, min: 0, default: 0 },
    fat: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }, // no necesita su propio _id, es un subdocumento
);

const MealSchema = new Schema<IMeal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // búsquedas frecuentes por usuario
    },
    date: {
      type: Date,
      required: true,
      index: true, // búsquedas frecuentes por fecha
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    items: {
      type: [MealItemSchema],
      default: [],
    },
    // Totales precalculados
    totalCalories: { type: Number, default: 0, min: 0 },
    totalProtein: { type: Number, default: 0, min: 0 },
    totalCarbs: { type: Number, default: 0, min: 0 },
    totalFat: { type: Number, default: 0, min: 0 },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// Índice compuesto: buscar todas las comidas de un usuario en una fecha específica
MealSchema.index({ user: 1, date: 1 });

// Índice compuesto: filtrar por usuario + tipo de comida + fecha
MealSchema.index({ user: 1, mealType: 1, date: 1 });

export default mongoose.model<IMeal>("Meal", MealSchema);
