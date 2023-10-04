import time
            chr_options.add_experimental_option("detach", True)

        if cls.hideWindow:
            chr_options.add_argument("--headless")

        cls.browser = webdriver.Chrome(options=chr_options)

    @classmethod
    def tearDownClass(cls):
        pass

    def setUp(self):
        self.browser.get(path.join(getcwd(), "index.html"))

    def tearDown(self):
        self.browser.get("about:blank")

    def testName(self):
        name = self.browser.find_element(By.ID, "Name")
        self.assertEqual(name.text, "Simon Clavensjö")

    def testNav(self):
        links = self.browser.find_elements(By.CLASS_NAME, "nav-link")
        for link in links:
            link.click()

    def helperTestLinks(self, link, expected):
        link.click()
        self.assertEqual(self.browser.current_url, expected)
        self.browser.back()

    def testIconLinks(self):
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='html icon']"),"https://developer.mozilla.org/en-US/docs/Web/HTML") 
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='css icon']"),"https://developer.mozilla.org/en-US/docs/Web/CSS") 
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='javaScript icon']"),"https://developer.mozilla.org/en-US/docs/Web/JavaScript")
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='typescript icon']"),"https://www.typescriptlang.org/")
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='node icon']"),"https://nodejs.org/en")
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='express icon']"),"https://expressjs.com/")
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='mysql icon']"),"https://www.mysql.com/")
        self.helperTestLinks(self.browser.find_element(By.CSS_SELECTOR, "[alt='python icon']"),"https://www.python.org/")

