import * as PIXI from "pixi.js";
import { IFontMetrics } from "./types";

const PX_PER_EM = 16;
const PX_PER_PERCENT = 16 / 100;
const PX_PER_PT = 1.3281472327365;

export const measureFont = (context: { font: string }): IFontMetrics =>
    PIXI.TextMetrics.measureFont(context.font);

export const INITIAL_FONT_PROPS: IFontMetrics = {
    ascent: 10,
    descent: 3,
    fontSize: 13,
};

// TODO: Memoize
export const getFontPropertiesOfText = (
    textField: PIXI.Text,
    forceUpdate = false
): IFontMetrics => {
    if (forceUpdate) {
        textField.updateText(false);
        return measureFont(textField.context);
    } else {
        const props = measureFont(textField.context);
        const fs = Number(textField.style.fontSize) ?? NaN;
        if (
            props.ascent === INITIAL_FONT_PROPS.ascent &&
            props.descent === INITIAL_FONT_PROPS.descent &&
            (isNaN(fs) || fs > INITIAL_FONT_PROPS.fontSize)
        ) {
            throw new Error(
                "getFontPropertiesOfText() returned metrics associated with a Text field that has not been updated yet. Please try using the forceUpdate parameter when you call this function."
            );
        }
        return measureFont(textField.context);
    }
};

export const addChildrenToContainer = (
    children: PIXI.DisplayObject[],
    container: PIXI.Container
): void => children.forEach((child) => container.addChild(child));

export const cloneSprite = (sprite: PIXI.Sprite): PIXI.Sprite =>
    new PIXI.Sprite(sprite.texture);

export const fontSizeStringToNumber = (size: string): number => {
    const [valueString, unit] = size.split(/(%|pt|px|r?em)/);
    const value = parseFloat(valueString);

    if (isNaN(value)) {
        NaN;
    }

    switch (unit) {
        case "%":
            return value * PX_PER_PERCENT;
        case "em":
        case "rem":
            return value * PX_PER_EM;
        case "pt":
            return value * PX_PER_PT;
        case "px":
        default:
            // keep as is.
            return value;
    }
};
