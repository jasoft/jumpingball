/**
 * 默认运行参数及可调范围说明.
 * 所有数值都可在 UI 滑块中调整, 也可以直接修改这里的默认值.
 */
export const DEFAULT_CONFIG = {
    playRadiusRatio: 0.42, // 内圈半径占窗口短边的比例 (0.32 ~ 0.48)
    initialBallRatio: 0.04, // 小球初始半径比例 (0.02 ~ 0.08)
    gravityScale: 2.4, // 重力与舞台半径比例 (1.0 ~ 4.0)
    minGravity: 980, // 重力下限, px/s² (400 ~ 1600)
    normalMultiplier: 1.02, // 正常碰撞半径放大倍率 (1.005 ~ 1.05)
    nearBoundaryMultiplier: 1.005, // 接近边缘时的放大倍率 (1.001 ~ 1.01)
    nearBoundaryRatio: 0.85, // 判定“接近边缘”的半径比例 (0.75 ~ 0.98)
    placementPadding: 0.5, // 与边界的最小距离, px (0.1 ~ 2)
    collisionCooldown: 140, // 两次有效碰撞的冷却, ms (60 ~ 300)
    beatLength: 0.45, // 音符基准节拍时长, s (0.25 ~ 0.7)
    sustainExtra: 0.8, // 额外延音时长, s (0.2 ~ 1.5)
    noteGain: 0.25, // 单个音符的音量 (0.05 ~ 0.4)
    musicKey: "twinkle", // 默认乐曲
}

export const PARAM_METADATA = [
    {
        key: "playRadiusRatio",
        label: "舞台半径占比",
        min: 0.32,
        max: 0.48,
        step: 0.005,
        description: "控制弹跳区域的直径 (0.32~0.48)",
    },
    {
        key: "initialBallRatio",
        label: "小球初始尺寸",
        min: 0.02,
        max: 0.08,
        step: 0.002,
        description: "设定开局时的小球半径 (0.02~0.08)",
    },
    {
        key: "gravityScale",
        label: "重力比例",
        min: 1,
        max: 4,
        step: 0.05,
        description: "垂直重力与舞台半径的比例 (1.0~4.0)",
    },
    {
        key: "minGravity",
        label: "重力下限 (px/s²)",
        min: 400,
        max: 1600,
        step: 20,
        description: "保证最小重力加速度, 建议范围 400~1600",
    },
    {
        key: "normalMultiplier",
        label: "碰撞增幅",
        min: 1.005,
        max: 1.05,
        step: 0.001,
        description: "普通碰撞的半径放大倍数 (1.005~1.05)",
    },
    {
        key: "nearBoundaryMultiplier",
        label: "贴边增幅",
        min: 1.001,
        max: 1.01,
        step: 0.0005,
        description: "接近外圈时的半径放大倍数 (1.001~1.01)",
    },
    {
        key: "nearBoundaryRatio",
        label: "贴边判定",
        min: 0.75,
        max: 0.98,
        step: 0.005,
        description: "达到该比例后启用贴边增幅 (0.75~0.98)",
    },
    {
        key: "collisionCooldown",
        label: "碰撞冷却 (ms)",
        min: 60,
        max: 300,
        step: 10,
        description: "限制连续碰撞触发频率 (60~300 ms)",
    },
    {
        key: "beatLength",
        label: "节拍长度 (s)",
        min: 0.25,
        max: 0.7,
        step: 0.01,
        description: "音符基础长度 (0.25~0.7 s)",
    },
    {
        key: "sustainExtra",
        label: "延音长度 (s)",
        min: 0.2,
        max: 1.5,
        step: 0.05,
        description: "在节拍之外额外延长的时间 (0.2~1.5 s)",
    },
    {
        key: "noteGain",
        label: "音量",
        min: 0.05,
        max: 1,
        step: 0.01,
        description: "音符的响度 (0.05~1)",
    },
]

const TWINKLE_SEQUENCE = [
    { freq: 261.63, beats: 1 },
    { freq: 261.63, beats: 1 },
    { freq: 392.0, beats: 1 },
    { freq: 392.0, beats: 1 },
    { freq: 440.0, beats: 1 },
    { freq: 440.0, beats: 1 },
    { freq: 392.0, beats: 2 },
    { freq: 349.23, beats: 1 },
    { freq: 349.23, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 293.66, beats: 1 },
    { freq: 293.66, beats: 1 },
    { freq: 261.63, beats: 2 },
    { freq: 392.0, beats: 1 },
    { freq: 392.0, beats: 1 },
    { freq: 349.23, beats: 1 },
    { freq: 349.23, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 293.66, beats: 2 },
    { freq: 392.0, beats: 1 },
    { freq: 392.0, beats: 1 },
    { freq: 349.23, beats: 1 },
    { freq: 349.23, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 293.66, beats: 2 },
    { freq: 261.63, beats: 1 },
    { freq: 261.63, beats: 1 },
    { freq: 392.0, beats: 1 },
    { freq: 392.0, beats: 1 },
    { freq: 440.0, beats: 1 },
    { freq: 440.0, beats: 1 },
    { freq: 392.0, beats: 2 },
    { freq: 349.23, beats: 1 },
    { freq: 349.23, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 329.63, beats: 1 },
    { freq: 293.66, beats: 1 },
    { freq: 293.66, beats: 1 },
    { freq: 261.63, beats: 2 },
]

const MOONLIGHT_SEQUENCE = [
    // 前奏（8小节）
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 392.0, beats: 1.5 }, // G4（5）- 附点四分音符（延长半拍）
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 369.99, beats: 1.5 }, // F#4（#4）- 附点四分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 392.0, beats: 1.5 }, // G4（5）- 附点四分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 369.99, beats: 0.5 }, // F#4（#4）- 八分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 369.99, beats: 0.5 }, // F#4（#4）- 八分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 277.18, beats: 0.5 }, // C#4（7）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 1.0 }, // D4（1）- 四分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 311.13, beats: 1.0 }, // 升D4（#1）- 四分音符

    // 主歌第一段（8小节）
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 277.18, beats: 0.5 }, // C#4（7）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 1.0 }, // D4（1）- 四分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 311.13, beats: 1.0 }, // 升D4（#1）- 四分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 277.18, beats: 0.5 }, // C#4（7）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 2.0 }, // D4（1）- 二分音符（2拍）
    { freq: 0.0, beats: 1.0 }, // 休止符 - 四分音符（换气）
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 369.99, beats: 0.5 }, // F#4（#4）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 369.99, beats: 0.5 }, // F#4（#4）- 八分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 369.99, beats: 0.5 }, // F#4（#4）- 八分音符
    { freq: 349.23, beats: 1.0 }, // F4（4）- 四分音符
    { freq: 293.66, beats: 1.0 }, // D4（1）- 四分音符

    // 主歌第二段（8小节，旋律重复第一段，微调尾音）
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 277.18, beats: 0.5 }, // C#4（7）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 1.0 }, // D4（1）- 四分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 311.13, beats: 1.0 }, // 升D4（#1）- 四分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 277.18, beats: 0.5 }, // C#4（7）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 2.0 }, // D4（1）- 二分音符
    { freq: 0.0, beats: 1.0 }, // 休止符 - 四分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 392.0, beats: 1.0 }, // G4（5）- 四分音符
    { freq: 293.66, beats: 1.0 }, // D4（1）- 四分音符

    // 间奏（4小节）
    { freq: 587.33, beats: 0.5 }, // D5（高音1）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 392.0, beats: 1.0 }, // G4（5）- 四分音符
    { freq: 440.0, beats: 1.0 }, // A4（6）- 四分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 587.33, beats: 0.5 }, // D5（高音1）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 493.88, beats: 1.0 }, // B4（7）- 四分音符
    { freq: 392.0, beats: 1.0 }, // G4（5）- 四分音符

    // 副歌（8小节，高音段）
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 440.0, beats: 1.0 }, // A4（6）- 四分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 493.88, beats: 1.0 }, // B4（7）- 四分音符
    { freq: 587.33, beats: 0.5 }, // D5（高音1）- 八分音符
    { freq: 587.33, beats: 0.5 }, // D5（高音1）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 392.0, beats: 2.0 }, // G4（5）- 二分音符
    { freq: 0.0, beats: 1.0 }, // 休止符 - 四分音符
    { freq: 587.33, beats: 0.5 }, // D5（高音1）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 392.0, beats: 1.0 }, // G4（5）- 四分音符
    { freq: 440.0, beats: 1.0 }, // A4（6）- 四分音符
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 523.25, beats: 0.5 }, // C5（高音7）- 八分音符
    { freq: 587.33, beats: 1.0 }, // D5（高音1）- 四分音符
    { freq: 523.25, beats: 1.0 }, // C5（高音7）- 四分音符

    // 尾奏（4小节，渐弱收尾）
    { freq: 493.88, beats: 0.5 }, // B4（7）- 八分音符
    { freq: 440.0, beats: 0.5 }, // A4（6）- 八分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 293.66, beats: 1.0 }, // D4（1）- 四分音符
    { freq: 349.23, beats: 1.0 }, // F4（4）- 四分音符
    { freq: 392.0, beats: 0.5 }, // G4（5）- 八分音符
    { freq: 349.23, beats: 0.5 }, // F4（4）- 八分音符
    { freq: 293.66, beats: 0.5 }, // D4（1）- 八分音符
    { freq: 311.13, beats: 0.5 }, // 升D4（#1）- 八分音符
    { freq: 293.66, beats: 2.0 }, // D4（1）- 二分音符
    { freq: 0.0, beats: 1.0 }, // 休止符 - 四分音符（结束换气）
]

export const MUSIC_LIBRARY = {
    twinkle: TWINKLE_SEQUENCE,
    moonlight: MOONLIGHT_SEQUENCE,
}

export const MUSIC_OPTIONS = [{ key: "twinkle", label: "小星星" }]
