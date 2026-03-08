import { Button } from "@/components/ui/button";
import {ArrowRight, Briefcase, TrendingUp, CheckCircle2} from "lucide-react"
import Link from "next/link";
import Image from "next/image";
import ImageTabs from "@/components/image-tabs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {/* Hero section */}
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-black mb-6 text-6xl font-bold">A better way to track your job applications.</h1>
            <p className="text-muted-foreground mb-10 text-xl">Capture, organize, and manage your job applications all in one place.</p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg font-medium">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </Link>
              <p className="text-sm text-muted-foreground">No credit card required</p>
            </div>
          </div>
        </section>
        {/* Hero Image Section with Tabs */}
        <ImageTabs />
        {/* Features section */}
        <section className="border-t bg-white py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
                  <Briefcase className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">Organize Applications</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse sint fuga, molestias tempore, ex unde aut excepturi, earum facilis ab quidem laboriosam eligendi in possimus aliquam sit quas consequatur mollitia.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">Get Hired</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse sint fuga, molestias tempore, ex unde aut excepturi, earum facilis ab quidem laboriosam eligendi in possimus aliquam sit quas consequatur mollitia.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg"/>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">Manage Boards</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse sint fuga, molestias tempore, ex unde aut excepturi, earum facilis ab quidem laboriosam eligendi in possimus aliquam sit quas consequatur mollitia.
                </p>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
