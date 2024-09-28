import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';
import Home from './components/home';

const customColor: MantineColorsTuple = [
    "#e6f9ff",
    "#d9ecf3",
    "#b8d6e1",
    "#94bfd0",
    "#75abc0",
    "#619fb7",
    "#5599b4",
    "#43859e",
    "#36778f",
    "#1f677f"
  ]


const theme = createTheme({
    defaultRadius: 'md',
    primaryColor: 'customColor',
    colors: {
        customColor: customColor,
    },
})

function App() {

  return (
    <MantineProvider theme={theme}>
        <Home/>
    </MantineProvider>
  )
}

export default App
