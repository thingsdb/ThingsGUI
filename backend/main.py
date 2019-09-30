from backend.app import App

app = App(port=8080, config_file='default.conf')
app.start()

