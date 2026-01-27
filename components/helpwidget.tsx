import { Fragment, useState } from "react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import {
  IconInfoCircle,
  IconBook,
  IconBrandGithub,
  IconBug,
  IconBrandDiscord,
  IconMail,
  IconCopyright,
} from "@tabler/icons-react";
import packageJson from "../package.json";

const HelpWidget = () => {
  const [showCopyright, setShowCopyright] = useState(false);

	function clsx(...classes: (string | undefined | null | false)[]): string {
		return classes.filter(Boolean).join(" ");
	}
  return (
    <>
      <Popover
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[9999]">
        <Popover.Button className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <IconInfoCircle className="w-5 h-5 md:w-6 md:h-6" />
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-2 scale-95"
        >
          <Popover.Panel className="absolute bottom-14 md:bottom-16 right-0 w-64 origin-bottom-right rounded-xl bg-white dark:bg-zinc-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-700">
                <img src="/logo.png" alt="Firefli" className="h-8 w-auto" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Firefli
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    v{packageJson.version}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <a
                  href="https://docs.firefli.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                >
                  <IconBook className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm">Documentation</span>
                </a>
                <a
                  href="https://github.com/TeamFirefli/firefli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                >
                  <IconBrandGithub className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="https://feedback.firefli.net/bugs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                >
                  <IconBug className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm">Bug Reports</span>
                </a>
                <a
                  href="https://discord.gg/WtEkchUKqe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                >
                  <IconBrandDiscord className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm">Community</span>
                </a>
                <a
                  href="mailto:support@firefli.net"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-200"
                >
                  <IconMail className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm">Contact Us</span>
                </a>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setShowCopyright(true)}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-500 dark:text-zinc-400 w-full"
                >
                  <IconCopyright className="w-4 h-4" />
                  <span className="text-xs">Copyright Notices</span>
                </button>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      <Transition appear show={showCopyright} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[10000]"
          onClose={() => setShowCopyright(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-zinc-900 dark:text-white"
                  >
                    Copyright Notices
                  </Dialog.Title>
                  <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 space-y-3">
                    <p>© {new Date().getFullYear()} Firefli. All rights reserved.</p>
                    <p>
                      This software is licensed under the terms of its license
                      agreement.
                    </p>
                    <p>© 2025 Planetary. All rights reserved.</p>
                    <p>© 2024 Tovy. All rights reserved.</p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2"
                      onClick={() => setShowCopyright(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default HelpWidget;
