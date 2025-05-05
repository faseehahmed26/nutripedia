## Description

**NutriPedia** is a smart AI-driven platform designed to help users make healthier eating choices by identifying fruits and vegetables from images and providing detailed nutritional information. The system leverages a combination of computer vision and natural language processing to make dietary awareness accessible, engaging, and personalized.

##### 🔍 Core Technology

At the heart of NutriPedia is the **Inception-V3** Convolutional Neural Network, a state-of-the-art model known for its speed and accuracy in image classification tasks. It replaces traditional 5×5 convolutions with two 3×3 convolutions, reducing computational cost by **33%**, and delivering high performance on food image datasets.

- 📸 **Inception-V3**: Used to classify fruit and vegetable images captured by the user
- 📚 **Fruits and Vegetables Nutritional Database**: Stores detailed nutrition profiles such as calories, sugar, fat, water content, potassium, sodium, and vitamins for each identified item
- 🧠 **GPT-3.5**: Transforms raw nutrition data into user-friendly summaries and dietary suggestions

##### ⚙️ How It Works

1. **User uploads or captures an image** of a fruit or vegetable.
2. The **Inception-V3 model** classifies the item with high precision.
3. The system retrieves nutrition values for the identified item from a curated database.
4. **GPT-3.5** then frames this data into a **natural, conversational summary** that educates the user on the benefits and composition of that food item.

##### 💬 Example Output

> “The banana you scanned contains around 105 calories and is rich in potassium and vitamin B6. It’s a great choice for an energy boost and supports heart and muscle function.”

##### 🌱 Key Features

- High-accuracy fruit & vegetable classification
- Instant nutritional breakdown (calories, sugar, potassium, water, etc.)
- GPT-3.5-powered dietary summaries that are easy to understand
- User-friendly interface designed to promote healthier food habits
- Scalable architecture for future database expansion

##### 🎯 Purpose & Impact

NutriPedia meets the increasing demand for health-conscious tools that promote balanced diets. By combining deep learning and conversational AI, it empowers users to understand what they eat, encouraging informed choices and healthier living through a simple photo.
