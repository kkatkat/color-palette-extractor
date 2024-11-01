import { NumberInput, Switch, TextInput, useMantineTheme } from "@mantine/core";
import { Algorithm, Setting } from "../../logic/algorithm";

export default function AutoInput<T extends Algorithm>(props: Setting<T> & { value: any, onChange: (value: any) => void }) {
    const theme = useMantineTheme();

    if (props.Component) {
        return <props.Component {...props} value={props.value} onChange={props.onChange} />;
    }

    const additionalProps = { 
        size: props.primarySetting ? 'xl' : 'sm' 
    };

    if (props.settingType === 'number') {
        return (
            <NumberInput
                {...props}
                {...additionalProps}
                value={props.value}
                onChange={(value) => props.onChange(+value)}
            />
        );
    }

    if (props.settingType === 'boolean') {
        return (
            <Switch
                mt={theme.spacing.lg}
                {...props}
                {...additionalProps}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
            />
        );
    }

    if (props.settingType === 'string') {
        return (
            <TextInput
                {...props}
                {...additionalProps}
                value={props.value}
                onChange={(e) => props.onChange(e.currentTarget.value)}
            />
        )
    }
}