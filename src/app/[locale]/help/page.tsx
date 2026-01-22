import Header from "@/components/layout/Headers/header";
import { HelpPage } from "@/components/layout/supportPage/help-page";

export default function DesignIndexPage() {
	return (
    <div>
      <Header />
      <main className="px-4 py-16 sm:py-24">        
        <HelpPage/>
      </main>
    </div>
    )
}
