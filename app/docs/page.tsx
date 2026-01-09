"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Book,
  Box,
  Cloud,
  Cpu,
  Globe,
  Layers,
  Layout,
  Server,
  Shield,
  Zap,
  ArrowRight,
  MousePointer,
  Settings,
  Rocket,
  GitBranch,
  Database,
  HardDrive,
  Network,
  Lock,
  Key,
  Bell,
  Activity,
  FileText,
  Radio,
  Share2,
  Terminal,
  Code,
  Anchor,
  Wifi,
  RadioReceiver,
  Container,
  Globe2,
  Mail,
  Eye,
  FileJson,
  KeyRound,
  MessageSquare,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const SectionHeader = ({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle: string;
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
    className={`mb-12 text-center ${className}`}
  >
    <h2 className="mb-4 text-3xl font-bold  text-white md:text-4xl">{title}</h2>
    <p className="mx-auto max-w-2xl text-lg text-gray-400">{subtitle}</p>
  </motion.div>
);

const CategoryHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <motion.div
    variants={fadeInUp}
    className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-blue-400">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white">{title}</h3>
  </motion.div>
);

const StepCard = ({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <motion.div
    variants={fadeInUp}
    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-8 hover:border-blue-500/50 transition-colors duration-300"
  >
    <div className="absolute -right-4 -top-4 text-9xl font-bold text-white/3 group-hover:text-blue-500/5 transition-colors">
      {number}
    </div>
    <div className="relative z-10">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const ComponentCard = ({
  title,
  description,
  analogy,
  icon,
  color = "blue",
}: {
  title: string;
  description: string;
  analogy: string;
  icon: React.ReactNode;
  color?: "blue" | "purple" | "green" | "orange" | "red" | "pink" | "cyan";
}) => {
  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111] hover:bg-[#161616] transition-colors duration-300"
    >
      <div className="p-8 pb-0 flex-1">
        <div
          className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${colorStyles[color]} transition-transform duration-300 group-hover:rotate-6`}
        >
          {icon}
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white">{title}</h3>
        <p className="mb-6 text-gray-400 leading-relaxed text-sm">
          {description}
        </p>
      </div>

      <div className="mt-auto border-t border-white/5 bg-white/2 p-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full bg-yellow-500/10 p-1 text-yellow-500 shrink-0">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Simple Analogy
            </span>
            <p className="mt-1 text-sm text-gray-300 italic">"{analogy}"</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 ">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              <Book className="h-4 w-4" />
              Beginner's Guide
            </div>
            <h1 className="mb-8 text-5xl capitalize font-bold  md:text-7xl">
              Become a Cloud Architect <br />
              <span className="text-gray-500">in Minutes</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-400 leading-relaxed">
              A complete, beginner-friendly encyclopedia of every DevOps
              component you need to know. From basic servers to advanced
              networking protocols, we've got you covered.
            </p>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="max-w-[80vw] mx-auto px-6 mb-32">
          <SectionHeader
            title="How It Works"
            subtitle="Building cloud infrastructure is as easy as playing with building blocks. Follow these three simple steps."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:grid-cols-3"
          >
            <StepCard
              number="01"
              icon={<MousePointer className="h-6 w-6" />}
              title="Drag & Drop"
              description="Pick components like servers or databases from the sidebar and place them on your canvas. It's like drawing a diagram."
            />
            <StepCard
              number="02"
              icon={<Settings className="h-6 w-6" />}
              title="Configure"
              description="Click on any component to adjust its settings. Choose the size, location, and name. We handle the technical details."
            />
            <StepCard
              number="03"
              icon={<Rocket className="h-6 w-6" />}
              title="Deploy"
              description="Click 'Export' to get a ready-to-use file. Upload it to Google Cloud, and watch your infrastructure come to life."
            />
          </motion.div>
        </section>

        {/* Component Encyclopedia */}
        <section className="max-w-[80vw] mx-auto px-6">
          <SectionHeader
            title="Component Encyclopedia"
            subtitle="Confused by all the cloud terms? Here's a simple guide to what each component actually does."
            className="mb-20"
          />

          {/* Compute Section */}
          <div className="mb-20">
            <CategoryHeader
              title="Compute & Containers"
              icon={<Cpu className="h-6 w-6" />}
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <ComponentCard
                title="App Engine"
                icon={<Layout className="h-6 w-6" />}
                color="blue"
                description="A fully managed platform for building web applications. You just write the code, and Google handles the servers."
                analogy="Like renting a fully furnished apartment. You just move in; the landlord handles maintenance, electricity, and security."
              />
              <ComponentCard
                title="Cloud Run"
                icon={<Zap className="h-6 w-6" />}
                color="orange"
                description="Runs your code in 'containers' that start up instantly when needed and shut down when not in use."
                analogy="Like a taxi service. You only pay when you're actually riding, not for the car sitting in the garage."
              />
              <ComponentCard
                title="Compute Engine"
                icon={<Server className="h-6 w-6" />}
                color="purple"
                description="Virtual machines running in the cloud. It's a raw computer that you can configure exactly how you want."
                analogy="Like buying your own empty house. You have total control, but you also have to buy the furniture and fix the leaks."
              />
              <ComponentCard
                title="Kubernetes (GKE)"
                icon={<Container className="h-6 w-6" />} // Using Container icon if available, else Box
                color="blue"
                description="A system for automating deployment, scaling, and management of containerized applications."
                analogy="Like a conductor of a massive orchestra, ensuring every musician (container) plays the right note at the right time."
              />
              <ComponentCard
                title="Cloud Functions"
                icon={<Code className="h-6 w-6" />}
                color="cyan"
                description="Scalable pay-as-you-go functions as a service (FaaS) to run your code with zero server management."
                analogy="Like an on-demand handyman who shows up instantly to fix one specific thing and then leaves immediately."
              />
              <ComponentCard
                title="Spot VMs"
                icon={<DollarSign className="h-6 w-6" />} // Using DollarSign for cost savings
                color="green"
                description="Highly affordable compute instances suitable for batch jobs and fault-tolerant workloads."
                analogy="Like buying a last-minute standby flight ticket. It's super cheap, but you might get bumped off if the plane is full."
              />
              <ComponentCard
                title="Auto Scaler"
                icon={<Activity className="h-6 w-6" />}
                color="blue"
                description="Automatically adds more servers when traffic is high and removes them when traffic is low."
                analogy="Like a store manager who calls in more cashiers when the lines get long and sends them home when it's quiet."
              />
            </motion.div>
          </div>

          {/* Networking Section */}
          <div className="mb-20">
            <CategoryHeader
              title="Networking & Protocols"
              icon={<Globe className="h-6 w-6" />}
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <ComponentCard
                title="VPC Network"
                icon={<Network className="h-6 w-6" />}
                color="green"
                description="A virtual private network that connects your cloud resources securely, isolated from the public internet."
                analogy="Like the walls and gates around your property that define your private space and control who can enter."
              />
              <ComponentCard
                title="Load Balancer"
                icon={<GitBranch className="h-6 w-6" />}
                color="green"
                description="Distributes incoming traffic across multiple servers so no single server gets overwhelmed."
                analogy="Like a traffic cop at a busy intersection directing cars to different lanes so traffic keeps moving smoothly."
              />
              <ComponentCard
                title="Cloud CDN"
                icon={<Globe2 className="h-6 w-6" />}
                color="blue"
                description="Content Delivery Network that caches your content at locations all over the world for faster access."
                analogy="Like having a local warehouse in every city so customers get their deliveries instantly instead of waiting for shipping."
              />
              <ComponentCard
                title="Cloud DNS"
                icon={<Book className="h-6 w-6" />}
                color="purple"
                description="Scalable, reliable, and managed authoritative Domain Name System (DNS) service."
                analogy="Like the internet's phonebook. It translates human-readable names like 'google.com' into IP addresses computers understand."
              />
              <ComponentCard
                title="Cloud NAT"
                icon={<Router className="h-6 w-6" />} // Using Router or similar
                color="orange"
                description="Allows instances without public IP addresses to access the internet for updates."
                analogy="Like an office receptionist who handles all outgoing mail for employees so they don't need to give out their personal addresses."
              />
              <ComponentCard
                title="Cloud VPN"
                icon={<Lock className="h-6 w-6" />}
                color="red"
                description="Securely extends your peer network to Google's network through an IPsec VPN tunnel."
                analogy="Like a secure, private tunnel built through a public city that lets you travel safely between two secure buildings."
              />
              <ComponentCard
                title="HTTP/HTTPS"
                icon={<Globe className="h-6 w-6" />}
                color="cyan"
                description="The underlying protocol used by the World Wide Web. HTTPS adds encryption for security."
                analogy="Like sending a letter (HTTP) vs sending a letter in a locked, armored briefcase (HTTPS)."
              />
              <ComponentCard
                title="TCP"
                icon={<CheckCircle className="h-6 w-6" />}
                color="blue"
                description="Transmission Control Protocol. Reliable, ordered, and error-checked delivery of a stream of bytes."
                analogy="Like sending a package via certified mail where you get a receipt confirming it was delivered exactly as sent."
              />
              <ComponentCard
                title="UDP"
                icon={<Radio className="h-6 w-6" />}
                color="orange"
                description="User Datagram Protocol. Faster but unreliable delivery. Good for streaming and gaming."
                analogy="Like a live radio broadcast. It's fast and real-time, but if you miss a word due to static, it's gone forever."
              />
            </motion.div>
          </div>

          {/* Storage Section */}
          <div className="mb-20">
            <CategoryHeader
              title="Storage & Databases"
              icon={<Database className="h-6 w-6" />}
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <ComponentCard
                title="Cloud SQL"
                icon={<Database className="h-6 w-6" />}
                color="purple"
                description="A fully managed relational database service for MySQL, PostgreSQL, and SQL Server."
                analogy="Like a digital filing cabinet that automatically organizes, backs up, and secures your important documents."
              />
              <ComponentCard
                title="Cloud Storage"
                icon={<HardDrive className="h-6 w-6" />}
                color="orange"
                description="Store any amount of data and retrieve it as often as you like. Great for images, videos, and backups."
                analogy="Like an infinite self-storage unit where you can keep as many boxes as you want and access them anytime."
              />
              <ComponentCard
                title="Firestore"
                icon={<FileJson className="h-6 w-6" />}
                color="blue"
                description="A flexible, scalable NoSQL cloud database to store and sync data for client- and server-side development."
                analogy="Like a magical notebook where you can write down anything on any page, and it instantly appears in everyone else's notebook."
              />
              <ComponentCard
                title="Memorystore (Redis)"
                icon={<Zap className="h-6 w-6" />}
                color="red"
                description="In-memory data store service for Redis and Memcached. Extremely fast."
                analogy="Like your brain's short-term memory. It holds the things you need right now for instant access, unlike long-term storage."
              />
              <ComponentCard
                title="BigQuery"
                icon={<Search className="h-6 w-6" />}
                color="cyan"
                description="Serverless, highly scalable, and cost-effective multi-cloud data warehouse designed for business agility."
                analogy="Like a supercomputer librarian that can read millions of books in a second to find exactly the answer you're looking for."
              />
            </motion.div>
          </div>

          {/* Observability & Security */}
          <div className="mb-20">
            <CategoryHeader
              title="Observability & Security"
              icon={<Shield className="h-6 w-6" />}
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <ComponentCard
                title="Cloud Monitoring"
                icon={<Activity className="h-6 w-6" />}
                color="blue"
                description="Gain visibility into the performance, availability, and health of your applications and infrastructure."
                analogy="Like the dashboard of a car showing you speed, fuel levels, and engine temperature so you know everything is running smoothly."
              />
              <ComponentCard
                title="Cloud Logging"
                icon={<FileText className="h-6 w-6" />}
                color="orange"
                description="Real-time log management and analysis. Store, search, analyze, monitor, and alert on log data and events."
                analogy="Like a black box flight recorder that keeps a detailed history of every single thing that happened in the system."
              />
              <ComponentCard
                title="Alert Manager"
                icon={<Bell className="h-6 w-6" />}
                color="red"
                description="Service to handle alerts sent by client applications such as the Prometheus server."
                analogy="Like a security alarm system that calls you immediately if a window is broken or smoke is detected."
              />
              <ComponentCard
                title="IAM"
                icon={<KeyRound className="h-6 w-6" />}
                color="purple"
                description="Identity and Access Management. Manage access control by defining who (identity) has what access (role) for which resource."
                analogy="Like an ID card system in a high-security building. It determines who you are and which rooms you are allowed to enter."
              />
              <ComponentCard
                title="Secret Manager"
                icon={<Lock className="h-6 w-6" />}
                color="green"
                description="Secure and convenient storage system for API keys, passwords, certificates, and other sensitive data."
                analogy="Like a bank vault. You put your valuables inside, and only people with the specific key can open it to see what's inside."
              />
              <ComponentCard
                title="Cloud Armor"
                icon={<Shield className="h-6 w-6" />}
                color="blue"
                description="Security policies to protect your applications from denial of service and web attacks."
                analogy="Like a bouncer at a club who checks IDs and stops troublemakers from getting in."
              />
            </motion.div>
          </div>

          {/* Messaging & Advanced */}
          <div className="mb-20">
            <CategoryHeader
              title="Messaging & Advanced"
              icon={<Share2 className="h-6 w-6" />}
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <ComponentCard
                title="Pub/Sub"
                icon={<RadioReceiver className="h-6 w-6" />}
                color="cyan"
                description="Asynchronous messaging service that decouples services that produce events from services that process events."
                analogy="Like a newsletter subscription. The publisher sends one email, and thousands of subscribers receive it automatically."
              />
              <ComponentCard
                title="Cloud Tasks"
                icon={<ListTodo className="h-6 w-6" />}
                color="blue"
                description="Fully managed service that allows you to manage the execution, dispatch, and delivery of a large number of distributed tasks."
                analogy="Like a reliable personal assistant who writes down tasks you need done later and makes sure they happen at the exact right time."
              />
              <ComponentCard
                title="gRPC"
                icon={<Zap className="h-6 w-6" />}
                color="purple"
                description="A high-performance, open-source universal RPC framework."
                analogy="Like a direct brain-to-brain connection between two people, allowing them to share thoughts instantly without speaking."
              />
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[80vw] mx-auto mt-32 px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-[#111] px-6 py-20 border border-white/10">
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-bold  md:text-4xl">
                Ready to try it out?
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-lg text-gray-400">
                Now that you know the basics, jump into the builder and create
                your first architecture.
              </p>
              <Link
                href="/builder"
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-black transition-transform hover:scale-105"
              >
                Launch Builder
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-white/10 bg-[#020202] py-12 text-center text-sm text-gray-600">
        <div className="max-w-[80vw] mx-auto px-6">
          <p>© 2024 DevOps Architect. Built for builders.</p>
        </div>
      </footer>
    </div>
  );
}

// Helper icons that might not be in the import list or need custom fallback
function Router(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6.01 18h.01" />
      <path d="M10.01 18h.01" />
      <path d="M15 10v4" />
      <path d="M17.84 7.17a4 4 0 0 0-5.66 0" />
      <path d="M20.66 4.34a8 8 0 0 0-11.31 0" />
    </svg>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function Search(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function DollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
