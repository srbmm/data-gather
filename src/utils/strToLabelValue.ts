type LabelValue = {
    label: string;
    value: string;
}
export const strToLabelValue = (str: string): LabelValue[] => {
    return  str.split(',').map(item => ({value: item, label: item}));
}