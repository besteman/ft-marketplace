"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">
                🔍 How to Find Your Perfect Health Plan
              </h2>
              <p className="text-sm text-gray-600">
                Let us guide you through the process
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Step 1 */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Chip color="primary" size="sm" variant="flat">
                        Step 1
                      </Chip>
                      <h3 className="font-semibold">
                        👥 Tell Us About Your Family
                      </h3>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        • Select your family composition (individual, couple,
                        etc.)
                      </li>
                      <li>• Enter your average monthly salary</li>
                      <li>
                        • Add your ICHRA (Individual Coverage Health
                        Reimbursement Arrangement) amount
                      </li>
                    </ul>
                  </CardBody>
                </Card>

                {/* Step 2 */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Chip color="secondary" size="sm" variant="flat">
                        Step 2
                      </Chip>
                      <h3 className="font-semibold">📍 Choose Your Location</h3>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Select your state from the dropdown</li>
                      <li>
                        • Choose your county (this determines available plans)
                      </li>
                      <li>• Plan availability varies by location</li>
                    </ul>
                  </CardBody>
                </Card>

                {/* Step 3 */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Chip color="success" size="sm" variant="flat">
                        Step 3
                      </Chip>
                      <h3 className="font-semibold">
                        🔍 Filter & Compare Plans
                      </h3>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        • Use metal level filters (Bronze, Silver, Gold,
                        Platinum)
                      </li>
                      <li>• Filter by insurance company or plan type</li>
                      <li>
                        • Compare monthly premiums and out-of-pocket costs
                      </li>
                      <li>• View remaining budget after ICHRA contribution</li>
                    </ul>
                  </CardBody>
                </Card>

                {/* Metal Levels Explanation */}
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold">
                      🏅 Understanding Metal Levels
                    </h3>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Chip color="warning" size="sm" variant="flat">
                          Bronze
                        </Chip>
                        <span className="text-sm">
                          Lower premiums, higher deductibles (60% coverage)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Chip color="secondary" size="sm" variant="flat">
                          Silver
                        </Chip>
                        <span className="text-sm">
                          Moderate premiums and deductibles (70% coverage)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Chip color="success" size="sm" variant="flat">
                          Gold
                        </Chip>
                        <span className="text-sm">
                          Higher premiums, lower deductibles (80% coverage)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Chip color="primary" size="sm" variant="flat">
                          Platinum
                        </Chip>
                        <span className="text-sm">
                          Highest premiums, lowest deductibles (90% coverage)
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Tips */}
                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold">💡 Pro Tips</h3>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>
                        • Consider your expected healthcare usage when choosing
                        metal levels
                      </li>
                      <li>
                        • Higher metal levels are better if you have regular
                        medical expenses
                      </li>
                      <li>
                        • Check if your preferred doctors are in the plan&apos;s
                        network
                      </li>
                      <li>
                        • Review prescription drug coverage if you take
                        medications
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Got it! Let&apos;s start
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
