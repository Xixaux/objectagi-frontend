'use client';

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import Paper from '@mui/material/Paper';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { Box } from '@mui/material';

/**
 * Services and Subscriptions Settings Tab
 */

type FormType = {
  plan: 'personal' | 'professional' | 'enterprise';
};

const plans = [
  {
    value: 'personal',
    label: 'Personal',
    details: 'Starter plan for individuals.',
    price: 9,
  },
  {
    value: 'professional',
    label: 'Professional',
    details: 'Collaborate up to 10 people.',
    price: 29,
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    details: 'For bigger businesses.',
    price: 99,
  },
];

const DUMMY_SUBSCRIPTION = {
  currentPlan: 'professional',
  renewalDate: '2026-03-01',
  monthlyCost: 29.00,
  status: 'Active',
};

const schema = z.object({
  plan: z.enum(['personal', 'professional', 'enterprise']),
});

function PlanBillingTab() {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState } = useForm<FormType>({
    defaultValues: { plan: 'professional' },
    resolver: zodResolver(schema),
  });

  const { isDirty } = formState;

  async function onSubmit(formData: FormType) {
    setIsLoading(true);
    console.log('Redirecting to Stripe with new plan choice:', formData.plan);
    // window.location.href = `/api/stripe/checkout?plan=${formData.plan}`;
    setIsLoading(false);
  }

  const handleExternalBilling = () => {
    // Redirect to Stripe Customer Portal
    // window.location.href = 'https://billing.stripe.com/p/session/...';
    console.log('Redirecting to External Stripe Portal');
  };

  return (
    <div className="w-full max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <Typography className="text-xl">Change your plan</Typography>
          <Typography color="text.secondary">Select a new plan to upgrade or downgrade.</Typography>
        </div>

        <div className="mt-8 grid w-full gap-4 sm:grid-cols-3">
          <Controller
            name="plan"
            control={control}
            render={({ field }) => (
              <>
                {plans.map((plan) => (
                  <Paper
                    sx={(theme) => ({
                      '&.selected': {
                        border: `3px solid ${theme.palette.secondary.main}`,
                      },
                    })}
                    className={clsx(
                      'flex flex-1 cursor-pointer flex-col items-start justify-start rounded-md p-6 border-3 border-transparent relative',
                      field.value === plan.value ? 'selected' : ''
                    )}
                    onClick={() => field.onChange(plan.value)}
                    key={plan.value}
                  >
                    {field.value === plan.value && (
                      <ObjectAGISvgIcon className="absolute right-0 top-0 mr-3 mt-3" size={24} color="secondary">
                        heroicons-solid:check-circle
                      </ObjectAGISvgIcon>
                    )}
                    <Typography className="font-semibold uppercase">{plan.label}</Typography>
                    <Typography className="mt-1" color="text.secondary">
                      {plan.details}
                    </Typography>
                    <div className="flex-auto" />
                    <div className="flex items-end mt-4 text-lg">
                      <Typography className="font-bold">
                        {plan.price.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </Typography>
                      <Typography color="text.secondary"> / month</Typography>
                    </div>
                  </Paper>
                ))}
              </>
            )}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="contained"
            color="secondary"
            disabled={!isDirty || isLoading}
            type="submit"
          >
            Update Subscription
          </Button>
        </div>
      </form>

      <Divider className="mb-10 mt-12 border-t" />

      <div className="w-full">
        <Typography className="text-xl">Subscription & Billing</Typography>
        <Typography color="text.secondary">
          Manage your payment methods and download invoices via our secure payment partner.
        </Typography>

        <Paper 
          className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-lg border" 
          variant="outlined" 
        >
          <Box className="flex flex-col mb-4 sm:mb-0">
            <Typography variant="body1" className="font-semibold">
              Current Plan: {DUMMY_SUBSCRIPTION.currentPlan.toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Next Renewal: {DUMMY_SUBSCRIPTION.renewalDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monthly Cost: ${DUMMY_SUBSCRIPTION.monthlyCost.toFixed(2)}
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={handleExternalBilling}
            startIcon={<ObjectAGISvgIcon size={20}>heroicons-solid:external-link</ObjectAGISvgIcon>}
          >
            Manage Billing & Invoices
          </Button>
        </Paper>
      </div>

      <Box className="mt-8">
        <Alert severity="info">
          Subscription management, including cancellations and receipt history, is handled securely via Stripe.
        </Alert>
      </Box>
    </div>
  );
}

export default PlanBillingTab;