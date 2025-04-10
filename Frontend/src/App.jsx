function App() {
  return (
    <iframe
      src="http://localhost:3000/index.html"
      title="Standalone HTML"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none"
      }}
    />
  );
}

export default App;
