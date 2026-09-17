const navWavePath = "M0 0H1440V32C1360 56 1280 56 1200 32S1040 8 960 32S800 56 720 32S560 8 480 32S320 56 240 32S80 8 0 32Z";
const ribbonWavePath = "M0 56C170 6 345 100 550 54S930 5 1145 50S1370 94 1530 38V100H0Z";

export function WaterNavWave({ flipped = false }: { flipped?: boolean }) {
  return <svg className={`water-nav-wave${flipped ? " water-nav-wave--flipped" : ""}`} viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"><path d={navWavePath} transform={flipped ? "rotate(180 720 32)" : undefined} /></svg>;
}

export function WaterRibbonWave() {
  return <svg className="water-ribbon-wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d={ribbonWavePath} /></svg>;
}

export function WaterCardScallop() {
  return <svg className="water-card-scallop" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0C55 72 195 72 250 0C305 72 445 72 500 0C555 72 695 72 750 0C805 72 945 72 1000 0V100H0Z" /></svg>;
}
