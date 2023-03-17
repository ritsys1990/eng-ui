export const isInCrossFrame = window.self.location !== window.top.location;

export const isInLocalFrame = window.self !== window.top && !isInCrossFrame;

export const isInFrame = window.self !== window.top;

export const isLegacyMode = isInCrossFrame;
