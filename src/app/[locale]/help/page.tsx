import Header from "@/components/layout/Headers/header";
import { HelpPage } from "@/components/layout/supportPage/help-page";

const navigationData = [
  {
    title: 'Home',
    href: '/dashboard'
  },
  {
    title: 'Products',
    href: '/design/id/edit'
  },
  {
    title: 'About Us',
    href: '/about'
  },
  {
    title: 'Contacts',
    href: '/contacts'
  }
]

export default function DesignIndexPage() {
	return (
        <div>
            <Header navigationData={navigationData} />
            <div className="m-6">
                <HelpPage/>
            </div>
        </div>
    )
}
