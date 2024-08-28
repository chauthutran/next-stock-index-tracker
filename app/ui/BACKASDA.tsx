'use client';

import Navigation from './layout/Navigation';
import * as Constant from "@/lib/constant";
import { useMainUi } from '@/contexts/MainUiContext';
import StockIndexDetails from './stock-index-data/StockIndexDetails';
import HomePage from './HomePage';
import * as AppStore from "@/lib/AppStore";
import CompareStocksPage from './compare-stock-indexes-chart/CompareStockPage';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import WatchListPage from './watchlist/WatchListPage';
import PortfolioList from './portfolio/PortfolioList';
import StockTrending from './trending/StockTrending';


export default function AppWrapper() {

	const {mainPage} = useMainUi();

	return (
		<>
 <header className="bg-navy-blue text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <a href="#" className="text-xl font-semibold">BusinessCorp</a>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#services" className="hover:text-gold">Services</a></li>
          <li><a href="#about" className="hover:text-gold">About Us</a></li>
          <li><a href="#contact" className="hover:text-gold">Contact</a></li>
        </ul>
      </nav>
      <button className="bg-gold text-navy-blue px-4 py-2 rounded hover:bg-yellow-600">Get a Quote</button>
    </div>
  </header>

  <main className="container mx-auto p-4">
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h1 className="text-3xl font-bold text-navy-blue">Welcome to BusinessCorp</h1>
      <p className="text-gray-700 mt-4">Providing top-notch business solutions and professional services tailored to your needs.</p>
    </section>

    <section id="services" className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-navy-blue">Our Services</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-light-gray p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-navy-blue">Consulting</h3>
          <p className="text-gray-600 mt-2">Expert advice to streamline your business operations and strategies.</p>
        </div>
        <div className="bg-light-gray p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-navy-blue">Development</h3>
          <p className="text-gray-600 mt-2">Custom software and application development for your business needs.</p>
        </div>
        <div className="bg-light-gray p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-navy-blue">Support</h3>
          <p className="text-gray-600 mt-2">24/7 support to ensure smooth and uninterrupted service.</p>
        </div>
      </div>
    </section>

    <section id="about" className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-navy-blue">About Us</h2>
      <p className="text-gray-700 mt-4">BusinessCorp has been providing exceptional business solutions for over a decade. Our team of professionals is dedicated to delivering quality service and innovative solutions tailored to your unique needs.</p>
    </section>

    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-navy-blue mb-4">Client Data</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-navy-blue">Client</th>
            <th className="py-2 px-4 border-b text-navy-blue">Project</th>
            <th className="py-2 px-4 border-b text-navy-blue">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">Acme Corp</td>
            <td className="py-2 px-4 border-b">Website Redesign</td>
            <td className="py-2 px-4 border-b text-green-600">Completed</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Global Tech</td>
            <td className="py-2 px-4 border-b">App Development</td>
            <td className="py-2 px-4 border-b text-yellow-600">In Progress</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Innovate Ltd</td>
            <td className="py-2 px-4 border-b">Consulting</td>
            <td className="py-2 px-4 border-b text-gray-600">Pending</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="contact" className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-navy-blue">Contact Us</h2>
      <form className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded px-4 py-2" placeholder="Your Name" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded px-4 py-2" placeholder="Your Email" />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700">Message</label>
          <textarea id="message" className="mt-1 block w-full border border-gray-300 rounded px-4 py-2" placeholder="Your Message"></textarea>
        </div>
        <button type="submit" className="bg-gold text-navy-blue px-4 py-2 rounded hover:bg-yellow-600">Send Message</button>
      </form>
    </section>
  </main>

  <footer className="bg-navy-blue text-white p-4">
    <div className="container mx-auto text-center">
      <p>&copy; 2024 BusinessCorp. All rights reserved.</p>
      <p>
        <a href="#" className="hover:text-gold">Privacy Policy</a> | <a href="#" className="hover:text-gold">Terms of Service</a>
      </p>
    </div>
  </footer>

			{/* <div className="text-textPrimary">
				{ mainPage == Constant.UI_PAGE_HOME && <HomePage />}
				{ mainPage == Constant.UI_SYMBOL_DETAILS && <StockIndexDetails curPriceData={AppStore.getSelectedSymbolData()} />}
				{ mainPage == Constant.UI_PAGE_TRENDING && <StockTrending />}
				{ mainPage == Constant.UI_PAGE_COMPARE_STOCK_INDEXES_CHARTS && <CompareStocksPage />}

				{ mainPage == Constant.UI_PAGE_WATCH_LIST && <WatchListPage />}
				{ mainPage == Constant.UI_PAGE_PORTFOLIO && <PortfolioList />}
				
				{ mainPage == Constant.UI_PAGE_LOGIN && <LoginForm />}
				{ mainPage == Constant.UI_PAGE_AUTH_REGISTRATION && <RegisterForm />}
			</div> */}
		</>
	);
};