import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.example.familytree',
    appName: 'FamilyTree',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
