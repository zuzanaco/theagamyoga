import Image from "next/image";

const photos = [
  ["https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80", "Yoga pose outdoors"],
  ["https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80", "Sunlit landscape"],
  ["https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=700&q=80", "Yoga in a studio"],
  ["https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=700&q=80", "Meditation cushion"],
  ["https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=700&q=80", "Nature at golden hour"],
  ["https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=700&q=80", "Yoga mat and props"],
];

export function Gallery() { return <section className="gallery" aria-label="Practice gallery"><div className="gallery__heading container"><span className="eyebrow">A visual pause</span><p>Moments from the practice.</p></div><div className="gallery__grid">{photos.map(([src, alt]) => <div className="gallery__item" key={src}><Image src={src} alt={alt} fill sizes="(max-width: 560px) 50vw, (max-width: 960px) 33vw, 17vw" /></div>)}</div></section>; }
