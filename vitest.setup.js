import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

global.ResizeObserver = class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
    })),
})