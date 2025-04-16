import {FrameControlsColor, FrameCreateUpdateRequest, FrameGradient, FramePosition} from '../interfaces/frames'
import {IStory, StoryCreateUpdateRequest} from '../interfaces/stories'

export interface StoryFormValues {
    publish: boolean
    title: string
    image: string
    frames: FormStoryFrame[]
}

export interface FormStoryFrame extends FrameCreateUpdateRequest {
    action_available: boolean
    gradient_top: boolean
    gradient_bottom: boolean
    gradient_color: string
}

export const defaultFrame: FormStoryFrame = {
    header1: '',
    image: '',
    description: '',
    text_color: '#FFFFFF',
    position: FramePosition.BOTTOM,
    controls_color: FrameControlsColor.DARK,
    gradient: FrameGradient.BOTH,
    action_url: '',
    action_text: '',

    action_available: false,
    gradient_bottom: false,
    gradient_top: false,
    gradient_color: '#000000'
}

export const defaultValues: StoryFormValues = {
    publish: false,
    title: '',
    image: '',
    frames: [defaultFrame]
}

export const getInitialValues = (story: IStory | null): StoryFormValues => {
    if (story) {
        return {
            publish: false,
            title: story.title,
            image: story.image,
            frames: story.frames.map(frame => {
                return {
                    ...frame,
                    text_color: frame.text_color.toUpperCase(),
                    gradient_color: frame.gradient_color.toUpperCase(),
                    action_available: !!frame.action_text,
                    action_text: frame.action_text || '',
                    action_url: frame.action_url || '',
                    gradient_bottom: [FrameGradient.BOTH, FrameGradient.BOTTOM].includes(frame.gradient),
                    gradient_top: [FrameGradient.BOTH, FrameGradient.TOP].includes(frame.gradient)
                }
            })
        }
    }

    return defaultValues
}

export const mapFormToRequestData = (values: StoryFormValues): StoryCreateUpdateRequest => ({
    image: values.image,
    title: values.title,
    frames: values.frames.map<FrameCreateUpdateRequest>(frame => {
        const {action_available, gradient_top, gradient_bottom, gradient_color, ...frameRequestData} = frame

        let formatGradient = FrameGradient.NONE

        if (gradient_top && gradient_bottom) {
            formatGradient = FrameGradient.BOTH
        } else if (gradient_top) {
            formatGradient = FrameGradient.TOP
        } else if (gradient_bottom) {
            formatGradient = FrameGradient.BOTTOM
        }

        return {
            ...frameRequestData,
            action_url: action_available && frameRequestData.action_url || undefined,
            action_text: action_available && frameRequestData.action_text || undefined,
            gradient: formatGradient,
            gradient_color: formatGradient !== FrameGradient.NONE && gradient_color || undefined
        }
    })
})
