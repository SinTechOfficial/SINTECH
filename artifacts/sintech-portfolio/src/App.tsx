import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { SiteLayout } from "./components/SiteLayout";

const HomePage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.HomePage })));
const ServicesPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.ServicesPage })));
const ServiceDetailPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.ServiceDetailPage })));
const WorkPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.WorkPage })));
const WorkDetailPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.WorkDetailPage })));
const AboutPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.AboutPage })));
const TeamPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.TeamPage })));
const CareersPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.CareersPage })));
const InsightsPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.InsightsPage })));
const InsightDetailPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.InsightDetailPage })));
const SecurityPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.SecurityPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((page) => ({ default: page.ContactPage })));
const PrivacyPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.TermsPage })));
const NotFoundPage = lazy(() => import("./pages/ContentPages").then((page) => ({ default: page.NotFoundPage })));

const queryClient = new QueryClient();
function RouteFocus() {
  const [path] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    const timer = window.setTimeout(() => document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true }), 0);
    return () => window.clearTimeout(timer);
  }, [path]);
  return null;
}
function Routes() {
  return <>
    <RouteFocus />
    <Suspense fallback={<div className="container-wide min-h-[55vh] py-20" role="status" aria-live="polite">Loading page…</div>}>
      <Switch>
        <Route path="/" component={HomePage}/>
        <Route path="/services" component={ServicesPage}/>
        <Route path="/services/:slug" component={ServiceDetailPage}/>
        <Route path="/work" component={WorkPage}/>
        <Route path="/work/:slug" component={WorkDetailPage}/>
        <Route path="/about" component={AboutPage}/>
        <Route path="/team" component={TeamPage}/>
        <Route path="/careers" component={CareersPage}/>
        <Route path="/insights" component={InsightsPage}/>
        <Route path="/insights/:slug" component={InsightDetailPage}/>
        <Route path="/security" component={SecurityPage}/>
        <Route path="/contact" component={ContactPage}/>
        <Route path="/privacy" component={PrivacyPage}/>
        <Route path="/terms" component={TermsPage}/>
        <Route component={NotFoundPage}/>
      </Switch>
    </Suspense>
  </>;
}
function App({ ssrPath }: { ssrPath?: string } = {}) {
  return <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} ssrPath={ssrPath}>
        <SiteLayout><Routes/></SiteLayout>
      </WouterRouter>
    </MotionConfig>
  </QueryClientProvider>;
}
export default App;
