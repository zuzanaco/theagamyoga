import { siteContent } from "@/content/siteContent";

export function Footer() { return <footer><div className="container footer"><a className="brand" href="#top">the<span>agam</span>yoga</a><p>Anitha Ramalingam · Cologne, Germany</p><p>A practice for stillness, not performance.</p><div><a href="#about">About</a><a href="#classes">Classes</a><a href="#reviews">Reviews</a><a href={siteContent.contact.instagram} target="_blank" rel="noreferrer">Instagram</a><a href="#contact">Contact</a></div><small>© {new Date().getFullYear()} theagamyoga. All rights reserved.</small></div></footer>; }
