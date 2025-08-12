// soundManager.js - 統一管理所有音效的初始化與播放

import { soundSettings } from './gconfig.js';

// 為了防止在音效初始化前呼叫而出錯，先用一個什麼都不做的空函式當作預設值
const dummySound = () => {};

// 導出 sounds 物件，讓其他模組可以立即引用
export const sounds = {
    start: dummySound,
    success: dummySound,
    tab: dummySound,
    open: dummySound,
    like: dummySound,
    gacha: dummySound,
    toDay: dummySound,
    toNight: dummySound,
};

let isInitialized = false;

/**
 * 初始化 Tone.js 音效引擎。
 * 這個函式必須在使用者首次與頁面互動（如點擊）後呼叫。
 */
export async function initSounds() {
    if (isInitialized) return; // 避免重複初始化
    try {
        await Tone.start();
        
        // 初始化成功後，用真正的音效函式覆蓋掉預設的空函式
        const mainSynth = new Tone.Synth().toDestination();
        const fmSynth = new Tone.FMSynth().toDestination();
        const tabSynth = new Tone.Synth().toDestination();

        sounds.start = () => fmSynth.triggerAttackRelease("C2", "8n");
        sounds.success = () => {
            mainSynth.triggerAttackRelease("C5", "16n", Tone.now());
            mainSynth.triggerAttackRelease("E5", "16n", Tone.now() + 0.1);
        };
        sounds.tab = () => tabSynth.triggerAttackRelease("C4", "32n");
        sounds.open = () => fmSynth.triggerAttackRelease("A3", "16n");
        sounds.like = () => mainSynth.triggerAttackRelease("A5", "32n");
        sounds.gacha = () => {
            const synth = new Tone.PolySynth(Tone.Synth).toDestination();
            const now = Tone.now();
            synth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "8n", now);
            synth.triggerAttackRelease(["F4", "A4", "C5", "E5"], "8n", now + 0.2);
            synth.triggerAttackRelease(["G4", "B4", "D5", "G5"], "4n", now + 0.4);
        };
        sounds.toDay = () => new Tone.AMSynth().toDestination().triggerAttackRelease("C4", "2n");
        sounds.toNight = () => new Tone.FMSynth().toDestination().triggerAttackRelease("G5", "8n");

        Tone.Master.volume.value = soundSettings.masterVolume;
        isInitialized = true;
        console.log("音效引擎已成功初始化。");

    } catch (e) {
        console.error("無法啟動音效引擎:", e);
    }
}
