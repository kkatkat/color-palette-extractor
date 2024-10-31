// import { NumberInput, Switch, TextInput } from "@mantine/core";
// import { Algorithm, AlgorithmSettings, Setting } from "../../logic/algorithm";


// export default function AutoInput<T extends Algorithm>(props: Setting<T> & { value: any, onChange: (value: any) => void }) {
//     if (props.Component) {
//         return <props.Component {...props} />
//     }

//     if (props.baseType === Number) {
//         return <NumberInput {...props} />
//     }

//     if (props.baseType === Boolean) {
//         return <Switch {...props} />
//     }

//     if (props.baseType === String) {
//         return <TextInput {...props} />
//     }
// }