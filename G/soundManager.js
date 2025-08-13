import { soundSettings } from './game-config.js';

const dummySound = () => {};

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

export async function initSounds() {
    if (isInitialized) return;
    try {
        await Tone.start();
        
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
