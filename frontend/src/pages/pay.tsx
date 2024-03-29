import { Inter } from "next/font/google";
import Head from "next/head";
import MainLayout from "@/components/layouts/main-layout";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { baseUrl, cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const inter = Inter({ subsets: ["latin"] });

export default function ForceInclusion() {
  const [data, setData] = useState({
    method: "",
    payableValue: 0,
    gas: 20,
    destination: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleExecute() {
    console.log(data);
    const gasAmount = (data.payableValue * data.gas) / 100;

    const obj: any = {
      withdraw: {
        value: data.payableValue.toString(),
      },
      deposit: {
        amount: data.payableValue.toString(),
      },
    };

    toast({
      title: "Processing your transaction",
      variant: "default",
    });

    setIsLoading(true);

    try {
      const res = await baseUrl.post(`/${data.method}`, obj[data.method]);

      toast({
        title: res.data,
        variant: "destructive",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }

    // setTimeout(() => {
    //   toast({
    //     title: "Transaction settled on L1",
    //     variant: "destructive",
    //   });
    // }, 4000);
  }

  return (
    <>
      <Head>
        <title>Pay</title>
      </Head>
      <MainLayout>
        <section className="p-4">
          <div
            className={cn(
              "h-[75vh] rounded-lg p-8 flex flex-col items-center justify-center",
              "bg-blue-400 bg-[url('/images/bg.png')]"
            )}
          >
            <div className="w-[500px] flex flex-col gap-6 border border-gray-200 p-8 rounded-lg bg-background">
              <div>
                <Label htmlFor="method">Method</Label>

                <Select
                  onValueChange={(val) => {
                    setData({ ...data, method: val });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="sendTxToL1">
                        Force Inclusion
                      </SelectItem>
                      <SelectItem value="withdraw">Withdraw Funds</SelectItem>
                      <SelectItem value="deposit">Deposit Funds</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Value</Label>
                <Input
                  type="number"
                  id="email"
                  placeholder="Value in ETH"
                  className="w-full"
                  onChange={(e) => {
                    setData({
                      ...data,
                      payableValue: parseInt(e.target.value),
                    });
                  }}
                />
              </div>

              <div className="py-0">
                <Label htmlFor="gas">Max Gas Fees (0-100%)</Label>
                <div className="h-2.5"></div>
                <Slider
                  defaultValue={[20]}
                  max={100}
                  step={1}
                  id="gas"
                  onValueChange={(val) => {
                    setData({ ...data, gas: val[0] });
                  }}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="destination">To (address)</Label>
                <Input
                  type="destination"
                  id="destination"
                  placeholder="Wallet address of the recipient"
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <Button onClick={handleExecute} disabled={isLoading}>
                Execute
              </Button>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
