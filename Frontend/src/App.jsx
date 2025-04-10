function App() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <iframe
        src="/index.html"
        title="Full Page Iframe"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          border: "none",
        }}
      />
    </div>
  );
}

export default App;
