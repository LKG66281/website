import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import Sidebar from '../components/Sidebar';
import '../styles/Quest.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function QuestPage() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const questId = new URLSearchParams(window.location.search).get('id');

  const [quest, setQuest] = useState(null);
  const [code, setCode] = useState('public class Main {\n    public static void main(String[] args) {\n        \n    }\n}');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const res = await axios.get(`${API}/quests/${questId}`);
        setQuest(res.data);
      } catch (error) {
        console.error('Error fetching quest:', error);
      } finally {
        setLoading(false);
      }
    };

    if (questId) {
      fetchQuest();
    }
  }, [questId]);

  const handleRun = async () => {
    setRunning(true);
    try {
      const res = await axios.post(`${API}/run`, { code });
      setOutput(res.data.output || res.data.error);
      setTestResults([]);
    } catch (error) {
      setOutput(error.response?.data?.error || 'Error running code');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setRunning(true);
    try {
      const res = await axios.post(`${API}/submit`, {
        code,
        questId,
        userId: user?.id,
      });
      setOutput(res.data.message);
      setTestResults(res.data.testResults || []);
    } catch (error) {
      setOutput(error.response?.data?.error || 'Error submitting code');
    } finally {
      setRunning(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f1e' }}>
        <Sidebar
          user={{
            name: user?.fullName,
            avatarUrl: user?.imageUrl,
            role: user?.publicMetadata?.role || 'user',
          }}
          onLogout={handleLogout}
          currentPage="quests"
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#00d4ff' }}>Loading quest...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f1e' }}>
      <Sidebar
        user={{
          name: user?.fullName,
          avatarUrl: user?.imageUrl,
          role: user?.publicMetadata?.role || 'user',
        }}
        onLogout={handleLogout}
        currentPage="quests"
      />
      <div className="quest-editor-container">
        <div className="quest-left">
          {quest && (
            <>
              <h2 className="problem-title">{quest.title}</h2>
              <p className="problem-description">{quest.description}</p>
              <div className="problem-examples">
                <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>Difficulty</h3>
                <div className="example-box">
                  <h4>{quest.difficulty} - Reward: {quest.xp_reward} XP</h4>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="quest-right">
          <div className="editor-section">
            <div className="editor-header">
              <h3>Java Code</h3>
              <span style={{ color: '#00d4ff' }}>Main.java</span>
            </div>
            <Editor
              height="100%"
              defaultLanguage="java"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Courier New', monospace",
              }}
            />
            <div className="editor-actions">
              <button className="btn-run" onClick={handleRun} disabled={running}>
                {running ? 'Running...' : '▶ Run'}
              </button>
              <button className="btn-submit" onClick={handleSubmit} disabled={running}>
                {running ? 'Submitting...' : '✓ Submit'}
              </button>
            </div>
          </div>

          <div className="output-section">
            <div className="output-header">Output</div>
            <div className={`output-content ${output.includes('Error') ? 'output-error' : ''}`}>
              {output || 'Run your code to see output...'}
            </div>
          </div>

          {testResults.length > 0 && (
            <div className="output-section">
              <div className="output-header">Test Results</div>
              <div className="test-results">
                {testResults.map((result, idx) => (
                  <div key={idx} className={`test-case ${result.passed ? '' : 'failed'}`}>
                    <span className={`test-status ${result.passed ? 'passed' : 'failed'}`}>
                      {result.passed ? '✓ PASSED' : '✗ FAILED'}
                    </span>
                    <span>{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
