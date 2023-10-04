import math
import time
from os import getcwd, mkdir, path
from unittest import TestCase, main

from selenium import webdriver
from selenium.webdriver.chrome.options import Options


class Tests(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.browser = webdriver.Chrome()
        chr_options = Options()

        chr_options.headless = True

        cls.browser = webdriver.Chrome(options=chr_options)

    def setUp(self):
        self.browser.get(path.join(getcwd(), "index.html"))

    def tearDown(self):
        self.browser.get("about:blank")

    def screenshot_helper(self, width, height):
        self.browser.set_window_size(width, height)
        p_height = self.browser.execute_script("return document.body.scrollHeight")
        if p_height > height:
            scroll_amount = math.ceil(p_height / height)
        else:
            scroll_amount = 1
        for i in range(scroll_amount):
            self.browser.execute_script(f"window.scrollTo(0, window.innerHeight*{i});")
            time.sleep(1)
            self.browser.save_screenshot(f"screenshots/{width}-{height}-{i}.png")

    def test_screenshots(self):
        if not path.exists("screenshots/"):
            mkdir("screenshots/")
        # phones and tablets
        self.screenshot_helper(360, 740)
        self.screenshot_helper(375, 667)
        self.screenshot_helper(393, 851)
        self.screenshot_helper(414, 896)
        self.screenshot_helper(520, 720)
        self.screenshot_helper(820, 1180)
        self.screenshot_helper(912, 1368)
        # desktop
        self.screenshot_helper(1024, 768)
        self.screenshot_helper(1280, 720)
        self.screenshot_helper(1920, 1080)
        self.screenshot_helper(2560, 1440)
        self.screenshot_helper(3840, 2160)


if __name__ == "__main__":
    main(verbosity=2)
