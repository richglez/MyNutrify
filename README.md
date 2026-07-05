# 🥗 MyNutrify

**MyNutrify** is a cross-platform mobile application (iOS and Android) focused on calorie tracking and improving daily nutrition. The application is developed with **React Native** and integrates artificial intelligence to support nutritional logging and analysis.


---
## 📱 Descripción de la App

MyNutrify tiene como objetivo ayudar a los usuarios a mejorar sus hábitos alimenticios mediante el registro inteligente y automatizado de alimentos, utilizando inteligencia artificial para analizar, personalizar y optimizar su consumo diario de calorías y macronutrientes, adaptándose a sus metas de salud, preferencias y estilo de vida.

---
## Overview:
**App Preview**
![App Preview](/server/docs/images/MyNutrify-Mobile-Application-Presentation(1).png)
![](/server/docs/images/MyNutrify-Mobile-Application-Presentation(2).png)
![](/server/docs/images/MyNutrify-Mobile-Application-Presentation(3).png)


---
## 🎯 Objetivo del Proyecto

El objetivo principal de **MyNutrify** es:

- Mejorar mis **habilidades técnicas** en el desarrollo de aplicaciones móviles multiplataforma.
- Aplica la IA para la implementacion del proyecto.
- Aplicar conceptos de **arquitectura full-stack**, escalabilidad y buenas prácticas.
- Fortalecer la **resolución de problemas** reales mediante una app funcional.
- Construir un proyecto sólido para **portafolio profesional**.

Desde el punto de vista del usuario, la app busca:
- Facilitar el **rastreo de calorías**.
- Brindar **información nutricional clara**.
- Ayudar a mejorar hábitos alimenticios con el apoyo de IA.
- Ofrecer informacion sobre nutricion.


---
## 🚀 Funcionalidades (MVP)

- Registro de usuarios (login / registro)
- Registro manual de alimentos y calorías
- Seguimiento diario de consumo calórico
- Historial de comidas
- Objetivo diario de calorías
- Apoyo de IA para:
  - Facilitar el registro de alimentos
  - Análisis nutricional básico
- Interfaz intuitiva y amigable


---
## 🛠️ Tecnologías Utilizadas

### Frontend (Mobile)
- **React Native**
- **Expo \ Expo-Go \ Expo-Router**
- **Zustand for state management**
- **TypeScript**
- React Navigation

### Backend
- **Node.js**
- **Express**
- **JWT** para autenticación

### Base de Datos
- **MongoDB** (MongoDB Atlas)

### Otros
- Inteligencia Artificial (para apoyo en análisis nutricional)
- Git & GitHub


---
## 🧠 Uso de Inteligencia Artificial

La IA en MyNutrify se utiliza como una herramienta de apoyo para:
- Simplificar el registro de alimentos
- Analizar información nutricional
- Mejorar la experiencia del usuario

> La IA no reemplaza asesoramiento médico o nutricional profesional.


---
## 📌 Estado del Proyecto

🚧 **En desarrollo**  
Este proyecto se encuentra actualmente en fase de desarrollo y evolución continua.


---
## Estructura del Proyecto
```
MyNutrify/
├── client/               
│   ├── .expo/
│   ├── .vscode/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── welcome.tsx
│   │   ├── (onboarding)/
│   │   │   ├── _layout.tsx
│   │   │   ├── step1-goal.tsx
│   │   │   ├── step2-goal.tsx
│   │   │   └── step3-goal.tsx
│   │   ├── (tabs)/
│   │   │   ├── diary/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── add-food.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── quick_actions_menu/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── searchFood.tsx
│   │   │   ├── settings/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── account.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── _layout.tsx
│   │   │   ├── explore.tsx
│   │   │   ├── index.tsx
│   │   │   └── post.tsx
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── services/
│   │   ├── foodServices.ts
│   │   └── userServices.ts
│   ├── store/
│   │   └── useAuthStore.ts
│   ├── types/
│   ├──.gitignore
│   ├── node_modules/     
│   └── app.json   
│   └── package.json
│   └── tsconfig.json
│
├── server/       
│   ├── docs/  
│   ├── node_modules/     
│   ├── src/
│   │   ├── controllers/  
│   │   │   ├── foodController.ts
│   │   │   ├── mealController.ts
│   │   │   └── userController.ts
│   │   ├── models/   
│   │   │   ├── Food.ts
│   │   │   ├── Meal.ts
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── foodRoutes.ts
│   │   │   ├── mealRoutes.ts
│   │   │   └── userRoutes.ts
│   │   └── server.ts             
│   ├── .gitignore           
│   └── package.json
│   └── tsconfig.json
└── .gitignore
└── README.md
```

---
## 📖 Futuras Mejoras

- Cálculo automático de TDEE
- Seguimiento de macronutrientes
- Estadísticas y gráficas semanales
- Recomendaciones personalizadas
- Integración con APIs de alimentos
- Modo oscuro

---
## 👨‍💻 Autor

Desarrollado por **[richglez]**  
Proyecto personal con fines educativos y de crecimiento profesional.

---
## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.
