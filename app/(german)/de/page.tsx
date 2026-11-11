import { HomePage } from "@/components/HomePage";

// Calendar keeps its existing five-minute server data cache.
export const revalidate = 0;

export default function Page() { return <HomePage language="de" />; }
