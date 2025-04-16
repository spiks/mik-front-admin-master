export enum FramePosition {
    BOTTOM = 'bottom',
    TOP = 'top'
}

export enum FrameControlsColor {
    LIGHT = 'light',
    DARK = 'dark'
}

export enum FrameGradient {
    TOP = 'top',
    BOTTOM = 'bottom',
    BOTH = 'both',
    NONE = 'none'
}

export interface IFrameShort {
    id: string
    image: string
    text_color: string
    header1: string
    description: string
    position: FramePosition
    controls_color: FrameControlsColor
    gradient: FrameGradient
    gradient_color: string
    action_url?: string
    action_text?: string
}

export interface IFrame extends IFrameShort {
    activated_at?: string
    created_at: string
}

// requests
export interface FrameCreateUpdateRequest {
    image: string
    text_color: string
    header1: string
    description: string
    position: FramePosition
    controls_color: FrameControlsColor
    gradient: FrameGradient
    gradient_color?: string
    action_url?: string
    action_text?: string
}
