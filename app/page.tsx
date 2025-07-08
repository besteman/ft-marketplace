import Link from "next/link";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to the Health Plan Marketplace
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Find and compare health insurance plans tailored to your needs.
        </p>
        <Link href="/plans">
          <Button className="px-8 py-3" color="primary" size="lg">
            Browse Plans
          </Button>
        </Link>
      </div>
    </section>
  );
}
