import {
    ComponentsButton,
    ComponentsModal,
    ComponentsSelect
} from "../types/ComponentsTypes";

export interface ICommandComponents {
    buttons?: ComponentsButton,
    selects?: ComponentsSelect,
    modals?: ComponentsModal,
}