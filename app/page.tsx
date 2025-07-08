import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center px-6">
      <Card className="max-w-4xl w-full bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardBody className="text-center p-12">
          {/* Badge */}
          <Chip
            className="mb-6"
            color="primary"
            size="lg"
            startContent={<span>🏛️</span>}
            variant="flat"
          >
            Official Government Marketplace
          </Chip>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Health Plan
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Compare plans, understand costs, and find coverage that fits your
            family&apos;s needs and budget.
          </p>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/plans">
              <Button
                className="px-8 py-4 text-lg font-semibold min-w-48"
                color="primary"
                size="lg"
              >
                Start Shopping
              </Button>
            </Link>
            <Button
              className="px-8 py-4 text-lg min-w-48"
              color="secondary"
              size="lg"
              variant="bordered"
            >
              Learn More
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
