
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AnalyticsClearButton = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [isClearing, setIsClearing] = useState(false);

  const clearAnalytics = async () => {
    if (!selectedPeriod) return;

    setIsClearing(true);
    try {
      let query = supabase.from('analytics_events').delete();

      const now = new Date();
      let cutoffDate: Date;

      switch (selectedPeriod) {
        case 'day':
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          query = query.gte('created_at', cutoffDate.toISOString());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', cutoffDate.toISOString());
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', cutoffDate.toISOString());
          break;
        case 'year':
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', cutoffDate.toISOString());
          break;
        case 'all':
          // Pas de filtre, supprimer tout
          break;
        default:
          return;
      }

      const { error } = await query;

      if (error) {
        throw error;
      }

      toast({
        title: "Données supprimées",
        description: `Les données analytics de la période sélectionnée ont été supprimées avec succès.`,
      });

      setSelectedPeriod('');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des données.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'day': return 'dernier jour';
      case 'week': return 'dernière semaine';
      case 'month': return 'dernier mois';
      case 'year': return 'dernière année';
      case 'all': return 'toutes les données';
      default: return '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sélectionner une période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Dernier jour</SelectItem>
          <SelectItem value="week">Dernière semaine</SelectItem>
          <SelectItem value="month">Dernier mois</SelectItem>
          <SelectItem value="year">Dernière année</SelectItem>
          <SelectItem value="all">Toutes les données</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={!selectedPeriod || isClearing}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Vider
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer les données analytics du {getPeriodLabel()} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={clearAnalytics} disabled={isClearing}>
              {isClearing ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnalyticsClearButton;
