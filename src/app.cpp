#include "app.h"

#include <QFontDatabase>
#include <QIcon>
#include <QStyleFactory>

#include "mainwindow.h"
#include "session.h"

App::App(int argc, char** argv)
    : QApplication(argc, argv)
{
    setApplicationName("GdP");
    setStyle(QStyleFactory::create("Fusion"));
    QFontDatabase::addApplicationFont(":/FontAwesome.otf");
    QIcon::setThemeName("UltraFlat");

    m_mainWindow = new MainWindow();
    m_mainWindow->resize(900, 400);
    m_mainWindow->show();
    connect(m_mainWindow, &MainWindow::destroyed, [=]() {
        m_mainWindow = NULL;
    });

    m_session = new Session(dataDir().absoluteFilePath("state"), this);
    m_session->restore();
    connect(this, &App::aboutToQuit, m_session, &Session::saveNow);
}

QDir App::dataDir() const
{
    QDir dir(QString("%1/data")
             .arg(applicationDirPath()));

    if (dir.exists() == false)
        dir.mkpath(dir.absolutePath());
    return dir;
}

MainWindow* App::mainWindow() const
{
    return m_mainWindow;
}

Session* App::session() const
{
    return m_session;
}
