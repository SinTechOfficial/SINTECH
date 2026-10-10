import { useEffect } from "react";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { SiteLayout } from "./components/SiteLayout";
import { ContactPage } from "./pages/ContactPage";
import {
  AboutPage, CareersPage, HomePage, InsightDetailPage, InsightsPage,
  NotFoundPage, PrivacyPage, SecurityPage, ServiceDetailPage, ServicesPage, TeamPage,
  TermsPage, WorkDetailPage, WorkPage,
} from "./pages/ContentPages";

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
