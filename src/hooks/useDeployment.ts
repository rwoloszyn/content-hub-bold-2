import { useState, useEffect } from 'react';

export interface Deployment {
  id: string;
  status: 'success' | 'error' | 'pending';
  timestamp: Date;
  url?: string;
  error?: string;
  note?: string;
}

export function useDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [lastDeployment, setLastDeployment] = useState<Deployment | null>(null);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);

  // Load last deployment from localStorage on mount
  useEffect(() => {
    const savedDeployment = localStorage.getItem('lastDeployment');
    if (savedDeployment) {
      try {
        const parsed = JSON.parse(savedDeployment);
        // Convert string timestamp back to Date object
        parsed.timestamp = new Date(parsed.timestamp);
        setLastDeployment(parsed);
      } catch (error) {
        console.error('Failed to parse saved deployment:', error);
      }
    }
  }, []);

  // Save last deployment to localStorage when it changes
  useEffect(() => {
    if (lastDeployment) {
      localStorage.setItem('lastDeployment', JSON.stringify(lastDeployment));
    }
  }, [lastDeployment]);

  // Poll for deployment status if there's an active deployment
  useEffect(() => {
    if (deployStatus === 'deploying' && deploymentId) {
      const interval = setInterval(async () => {
        await getDeploymentStatus(deploymentId);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [deployStatus, deploymentId]);

  const deployProject = async (note?: string): Promise<void> => {
    setIsDeploying(true);
    setDeployStatus('deploying');
    
    try {
      // Create a new deployment ID
      const newDeploymentId = `deploy_${Date.now()}`;
      setDeploymentId(newDeploymentId);
      
      // Create a new deployment record
      const newDeployment: Deployment = {
        id: newDeploymentId,
        status: 'pending',
        timestamp: new Date(),
        note,
      };
      
      setLastDeployment(newDeployment);
      
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update deployment status to success
      const successDeployment: Deployment = {
        ...newDeployment,
        status: 'success',
        url: 'https://contenthub-demo.netlify.app',
      };
      
      setLastDeployment(successDeployment);
      setDeployStatus('success');
    } catch (error) {
      // Update deployment status to error
      const errorDeployment: Deployment = {
        ...lastDeployment!,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      
      setLastDeployment(errorDeployment);
      setDeployStatus('error');
    } finally {
      setIsDeploying(false);
    }
  };

  const getDeploymentStatus = async (id: string): Promise<void> => {
    if (!id) return;
    
    try {
      // Simulate API call to check deployment status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just update the status after a delay
      if (lastDeployment && lastDeployment.id === id && lastDeployment.status === 'pending') {
        const updatedDeployment: Deployment = {
          ...lastDeployment,
          status: 'success',
          url: 'https://contenthub-demo.netlify.app',
        };
        
        setLastDeployment(updatedDeployment);
        setDeployStatus('success');
      }
    } catch (error) {
      console.error('Failed to get deployment status:', error);
    }
  };

  return {
    isDeploying,
    deployStatus,
    lastDeployment,
    deployProject,
    getDeploymentStatus,
  };
}