const navWavePath = "M0 0H1440V36C1280 33 1140 6 980 28C820 43 700 41 520 30C340 17 180 15 0 38Z";
export const waterRibbonTextPath = "M0 56C170 6 345 100 550 54S930 5 1145 50S1370 94 1530 38";
const waterRibbonTopPath = "M0 0H1530V38C1370 94 1360 95 1145 50C930 5 755 8 550 54C345 100 170 6 0 56Z";

export function WaterNavWave({ flipped = false }: { flipped?: boolean }) {
  return <svg className={`water-nav-wave${flipped ? " water-nav-wave--flipped" : ""}`} viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"><g transform={flipped ? "rotate(180 720 32)" : undefined}><path className="water-wave-motion-path" data-water-wave-kind="nav" d={navWavePath} /></g></svg>;
}

export function WaterRibbonWave() {
  return <svg className="water-ribbon-wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path className="water-wave-motion-path" data-water-wave-kind="ribbon" d={waterRibbonTopPath} /></svg>;
}

export function WaterCardScallop() {
  return <svg className="water-card-scallop" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0C62 0 63 52 125 52C187 52 188 0 250 0C312 0 313 52 375 52C437 52 438 0 500 0C562 0 563 52 625 52C687 52 688 0 750 0C812 0 813 52 875 52C937 52 938 0 1000 0V100H0Z" /></svg>;
}
