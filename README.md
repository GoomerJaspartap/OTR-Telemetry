# FSAE Telemetry Dashboard

A real-time telemetry dashboard for FSAE electric car teams, built with React, TypeScript, and Firebase.

## Features

- Real-time telemetry data visualization
- Live GPS tracking
- Battery pack monitoring
- 3D car orientation display
- Technical documentation wiki
- User authentication and authorization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- ESP32 microcontroller with CAN bus interface

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/fsae-telemetry.git
cd fsae-telemetry
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

4. Copy your Firebase configuration to `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

## ESP32 Setup

1. Install required libraries:
   - CAN.h
   - WiFi.h
   - Firebase_ESP_Client.h

2. Configure the ESP32 code with your:
   - WiFi credentials
   - Firebase project details
   - CAN bus settings

3. Upload the code to your ESP32

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── contexts/       # React contexts
  ├── pages/          # Page components
  ├── services/       # Firebase and other services
  ├── types/          # TypeScript interfaces
  └── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React
- TypeScript
- Firebase
- Material-UI
- Three.js
- Leaflet
- ESP32
