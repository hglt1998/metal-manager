import { useState, useCallback } from "react";

type TabValue = "general" | "ubicacion" | "restricciones" | "horarios";

const tabOrder: TabValue[] = ["general", "ubicacion", "restricciones", "horarios"];

export function useTabNavigation(initialTab: TabValue = "general") {
	const [activeTab, setActiveTab] = useState<TabValue>(initialTab);

	const goToNext = useCallback(() => {
		const currentIndex = tabOrder.indexOf(activeTab);
		if (currentIndex < tabOrder.length - 1) {
			setActiveTab(tabOrder[currentIndex + 1]);
		}
	}, [activeTab]);

	const goToPrevious = useCallback(() => {
		const currentIndex = tabOrder.indexOf(activeTab);
		if (currentIndex > 0) {
			setActiveTab(tabOrder[currentIndex - 1]);
		}
	}, [activeTab]);

	const goToTab = useCallback((tab: string) => {
		if (tabOrder.includes(tab as TabValue)) {
			setActiveTab(tab as TabValue);
		}
	}, []);

	const reset = useCallback(() => {
		setActiveTab(initialTab);
	}, [initialTab]);

	const isFirst = activeTab === tabOrder[0];
	const isLast = activeTab === tabOrder[tabOrder.length - 1];

	return {
		activeTab,
		goToNext,
		goToPrevious,
		goToTab,
		reset,
		isFirst,
		isLast
	};
}
