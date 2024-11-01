import { NumberInput, Switch, TextInput } from "@mantine/core";
import { Algorithm, Setting } from "../../logic/algorithm";

export default function AutoInput<T extends Algorithm>(props: Setting<T> & { value: any, onChange: (value: any) => void, extraProps?: object }) {
    if (props.Component) {
        return <props.Component {...props.componentProps} {...props.extraProps} value={props.value} onChange={props.onChange} />;
    }

    const additionalProps = {
        size: props.primarySetting ? 'xl' : 'sm',
    }

    const componentProps = {
        ...additionalProps,
        ...props.componentProps,
        ...props.extraProps,
    };

    if (props.settingType === 'number') {
        return (
            <NumberInput
                {...componentProps}
                value={props.value}
                onChange={(value) => props.onChange(+value)}
            />
        );
    }

    if (props.settingType === 'boolean') {
        return (
            <Switch
                {...componentProps}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
            />
        );
    }

    if (props.settingType === 'string') {
        return (
            <TextInput
                {...componentProps}
                value={props.value}
                onChange={(e) => props.onChange(e.currentTarget.value)}
            />
        )
    }
}