'use client'

import { useState } from 'react'
import { useAccount } from '@starknet-react/core'
import { Plus, Trash2, Users, Shield, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'

type Guardian = {
  id: string
  address: string
  name: string
  isValid?: boolean
}

type SetupStep = 'connect' | 'guardians' | 'threshold' | 'review' | 'complete'

export default function SetupPage() {
  const { isConnected } = useAccount()
  const [currentStep, setCurrentStep] = useState<SetupStep>(isConnected ? 'guardians' : 'connect')
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [newGuardianAddress, setNewGuardianAddress] = useState('')
  const [newGuardianName, setNewGuardianName] = useState('')
  const [threshold, setThreshold] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { id: 'connect', title: 'Connect Wallet', icon: Shield },
    { id: 'guardians', title: 'Add Guardians', icon: Users },
    { id: 'threshold', title: 'Set Threshold', icon: CheckCircle },
    { id: 'review', title: 'Review Setup', icon: ArrowRight },
    { id: 'complete', title: 'Complete', icon: CheckCircle },
  ]

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep)
  const isStepCompleted = (stepId: string) => getCurrentStepIndex() > steps.findIndex(step => step.id === stepId)
  const isStepActive = (stepId: string) => currentStep === stepId

  const validateStarkNetAddress = (addr: string): boolean => {
    return addr.startsWith('0x') && addr.length >= 60 && addr.length <= 66
  }

  const addGuardian = () => {
    if (!newGuardianAddress || !newGuardianName || guardians.length >= 5) return
    
    const isValid = validateStarkNetAddress(newGuardianAddress)
    const newGuardian: Guardian = {
      id: Date.now().toString(),
      address: newGuardianAddress,
      name: newGuardianName,
      isValid
    }
    
    setGuardians([...guardians, newGuardian])
    setNewGuardianAddress('')
    setNewGuardianName('')
  }

  const removeGuardian = (id: string) => {
    setGuardians(guardians.filter(g => g.id !== id))
  }

  const canProceedToThreshold = () => guardians.length >= 3 && guardians.every(g => g.isValid)
  const canProceedToReview = () => threshold >= 2 && threshold <= guardians.length
  
  const handleSubmitSetup = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Integrate with smart contract
      // 1. Generate Merkle tree from guardian addresses
      // 2. Call contract to store Merkle root
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate contract call
      setCurrentStep('complete')
    } catch (error) {
      console.error('Setup failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as SetupStep)
    }
  }

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as SetupStep)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl lg:text-5xl font-bold text-white">
          Setup Guardian Recovery
        </h1>
        <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
          Create your social recovery network in just a few simple steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isStepCompleted(step.id) 
                    ? 'bg-success-500 text-white' 
                    : isStepActive(step.id)
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {isStepCompleted(step.id) ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <StepIcon className="h-6 w-6" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`font-medium transition-colors duration-300 ${
                    isStepActive(step.id) ? 'text-white' : 'text-neutral-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 ml-4 transition-colors duration-300 ${
                    isStepCompleted(step.id) ? 'bg-success-500' : 'bg-neutral-700'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {/* Connect Wallet Step */}
        {currentStep === 'connect' && (
          <div className="card p-12 text-center space-y-8 animate-scale-in">
            <div className="space-y-4">
              <Shield className="h-16 w-16 text-primary-500 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
              <p className="text-neutral-300 max-w-md mx-auto">
                Connect your StarkNet wallet to begin setting up guardian recovery
              </p>
            </div>
            <div className="status-warning p-4 rounded-lg">
              <p className="text-warning-400">Please connect your wallet using the button in the top navigation</p>
            </div>
          </div>
        )}

        {/* Add Guardians Step */}
        {currentStep === 'guardians' && (
          <div className="grid lg:grid-cols-2 gap-8 animate-scale-in">
            {/* Guardian List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary-500" />
                  <span>Your Guardians</span>
                </h2>
                <div className="status-success px-3 py-1 rounded-full text-sm">
                  {guardians.length}/5
                </div>
              </div>

              <div className="space-y-3">
                {guardians.map((guardian) => (
                  <div key={guardian.id} className="card p-4 flex items-center justify-between group hover:shadow-glow transition-all duration-300">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-semibold">{guardian.name}</p>
                        {guardian.isValid ? (
                          <CheckCircle className="h-4 w-4 text-success-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-error-500" />
                        )}
                      </div>
                      <p className="text-neutral-400 text-sm font-mono">
                        {guardian.address.slice(0, 10)}...{guardian.address.slice(-8)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeGuardian(guardian.id)}
                      className="p-2 text-neutral-400 hover:text-error-400 hover:bg-error-500/10 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {guardians.length === 0 && (
                  <div className="card p-8 text-center">
                    <Users className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">No guardians added yet</p>
                    <p className="text-neutral-500 text-sm">Add at least 3 trusted guardians to continue</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Guardian Form */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary-500" />
                <span>Add Guardian</span>
              </h3>

              <div className="card p-6 space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    placeholder="e.g., Alice, Mom, Best Friend"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    StarkNet Address
                  </label>
                  <input
                    type="text"
                    value={newGuardianAddress}
                    onChange={(e) => setNewGuardianAddress(e.target.value)}
                    placeholder="0x..."
                    className="input-field w-full"
                  />
                  {newGuardianAddress && !validateStarkNetAddress(newGuardianAddress) && (
                    <p className="text-error-400 text-sm mt-1">Invalid StarkNet address format</p>
                  )}
                </div>

                <button
                  onClick={addGuardian}
                  disabled={!newGuardianAddress || !newGuardianName || guardians.length >= 5 || !validateStarkNetAddress(newGuardianAddress)}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Guardian
                </button>
              </div>

              {/* Requirements */}
              <div className="card p-4 bg-blue-500/5 border-blue-500/20">
                <h4 className="text-blue-400 font-semibold mb-2">Requirements</h4>
                <ul className="text-blue-300 text-sm space-y-1">
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${guardians.length >= 3 ? 'bg-success-500' : 'bg-neutral-600'}`} />
                    <span>Minimum 3 guardians required</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${guardians.length <= 5 ? 'bg-success-500' : 'bg-error-500'}`} />
                    <span>Maximum 5 guardians allowed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${guardians.every(g => g.isValid) ? 'bg-success-500' : 'bg-neutral-600'}`} />
                    <span>All addresses must be valid</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Threshold Step */}
        {currentStep === 'threshold' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-scale-in">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-primary-500 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Set Recovery Threshold</h2>
              <p className="text-neutral-300">
                Choose how many guardians must approve a recovery request
              </p>
            </div>

            <div className="card p-8 space-y-6">
              <div>
                <label className="block text-white font-medium mb-4">Recovery Threshold</label>
                <div className="space-y-3">
                  {Array.from({ length: guardians.length - 1 }, (_, i) => i + 2).map(num => (
                    <button
                      key={num}
                      onClick={() => setThreshold(num)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                        threshold === num
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{num} of {guardians.length} guardians</span>
                        <span className="text-sm">
                          {num === 2 ? 'More convenient' : num === guardians.length ? 'Most secure' : 'Balanced'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Threshold Explanation</h4>
                <p className="text-yellow-300 text-sm">
                  With {threshold} of {guardians.length} threshold, you&apos;ll need {threshold} guardians to approve any recovery request. 
                  Choose based on your security vs. convenience preference.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-scale-in">
            <div className="text-center space-y-4">
              <Shield className="h-16 w-16 text-primary-500 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Review Your Setup</h2>
              <p className="text-neutral-300">
                Double-check your guardian configuration before deploying
              </p>
            </div>

            <div className="space-y-6">
              {/* Guardian Summary */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Guardians ({guardians.length})</h3>
                <div className="space-y-3">
                  {guardians.map((guardian) => (
                    <div key={guardian.id} className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{guardian.name}</p>
                        <p className="text-neutral-400 text-sm font-mono">
                          {guardian.address.slice(0, 16)}...{guardian.address.slice(-16)}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-success-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold Summary */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recovery Threshold</h3>
                <div className="flex items-center justify-between p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <span className="text-primary-400 font-medium">
                    {threshold} of {guardians.length} guardians required
                  </span>
                  <CheckCircle className="h-5 w-5 text-primary-400" />
                </div>
              </div>

              {/* Deploy Button */}
              <button
                onClick={handleSubmitSetup}
                disabled={isSubmitting}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Deploying to StarkNet...
                  </>
                ) : (
                  <>
                    Deploy Guardian Setup
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-scale-in">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-success-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Setup Complete! 🎉</h2>
              <p className="text-neutral-300 text-lg">
                Your guardian recovery system is now active and secured on StarkNet
              </p>
            </div>

            <div className="card p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-success-400">{guardians.length}</p>
                  <p className="text-neutral-400">Guardians</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success-400">{threshold}</p>
                  <p className="text-neutral-400">Required Approvals</p>
                </div>
              </div>
              
              <div className="border-t border-neutral-700 pt-6">
                <h4 className="text-white font-semibold mb-3">What&apos;s Next?</h4>
                <ul className="text-neutral-300 text-sm space-y-2 text-left">
                  <li>• Your guardians can now help you recover your wallet</li>
                  <li>• Share the recovery link with trusted guardians</li>
                  <li>• Monitor your setup in the dashboard</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex-1">
                View Dashboard
              </button>
              <button className="btn-secondary flex-1">
                Share with Guardians
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStep !== 'connect' && currentStep !== 'complete' && (
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            className="btn-ghost flex items-center space-x-2"
            disabled={getCurrentStepIndex() === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextStep}
            disabled={
              (currentStep === 'guardians' && !canProceedToThreshold()) ||
              (currentStep === 'threshold' && !canProceedToReview())
            }
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <span>
              {currentStep === 'review' ? 'Deploy' : 'Continue'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}