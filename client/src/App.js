// client-side packages
import React from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// client-side utils, pages, components
import HomePage from './pages/HomePage';
import ConnectPage from './pages/ConnectPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import BreweryPage from './pages/BreweryPage';
import { ProfilePage } from './pages/ProfilePage';
import { UserProvider } from './components/UserProvider';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';


const { Content } = Layout;


function App() {

  // Ant Design UI theme
  const token = {
    colorPrimary: "#f4900c", // amber
    colorSuccess: "#ffe84d", // pale ale
    colorWarning: "#761618", // default
    colorInfo: "#c7a5d9" // lavender
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  


  return (
      <UserProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: token.colorPrimary,
              colorSuccess: token.colorSuccess,
              colorWarning: token.colorWarning,
              colorInfo: token.colorInfo
            }
          }}
        >
          {/* sets layout for navigation sidebar */}
          <Layout>
            <Router>
              <Sidebar />
              {/* sets inner layout for header, content, and footer */}
              <Layout>
                <Header
                  style={{
                    padding: 0,
                    background: colorBgContainer,
                  }}
                />
                {/* renders content section based on current url route */}
                <Content
                  style={{
                    margin: '24px 16px 0',
                  }}
                >
                  <Routes>
                    <Route
                      path='/profile/:username'
                      exact
                      element={
                        <ProfilePage
                          style={{
                          padding: 24,
                          minHeight: 360,
                          background: colorBgContainer,
                          }}
                        />}
                    />
                    <Route 
                      path='/breweries/:breweryId'
                      exact
                      element={
                        <BreweryPage/>
                      }
                    />
                    <Route
                      path='/breweries'
                      exact
                      element={
                        <SearchPage
                          style={{
                          padding: 24,
                          minHeight: 360,
                          background: colorBgContainer,
                          }}
                        />}
                    />
                    <Route
                      path='/connect'
                      exact
                      element={
                        <ConnectPage 
                          style={{
                          padding: 24,
                          minHeight: 360,
                          background: colorBgContainer,
                          }}
                        />}
                    />
                    <Route
                      path='/signup'
                      exact
                      element={
                        <SignupPage 
                          style={{
                          padding: 24,
                          minHeight: 360,
                          background: colorBgContainer,
                          }}
                        />}
                    />
                    <Route
                      path='/'
                      element={
                        <HomePage 
                          style={{
                          padding: 24,
                          minHeight: 360,
                          background: colorBgContainer,
                          }}
                        />}
                    />
                  </Routes>
                </Content>
                {/* ends inner layout with footer */}
                <Footer
                  style={{
                    textAlign: 'center',
                  }}
                />
              </Layout>
            </Router>
          </Layout>
        </ConfigProvider>
      </UserProvider>
  );
}

export default App;