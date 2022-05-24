import React from 'react';
import  { ThemeProvider } from 'styled-components';
import { Archivo_400Regular, Archivo_500Medium, Archivo_600SemiBold } from '@expo-google-fonts/archivo';
import { useFonts, Inter_400Regular, Inter_500Medium, } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import theme from './src/styles/theme';
import { Routes } from './src/routes';
import { AppProvider } from './src/hooks'

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular, Archivo_500Medium, Archivo_600SemiBold,
    Inter_400Regular, Inter_500Medium
  });

  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Routes />
      </AppProvider>
    </ThemeProvider>  
  ) 
}

